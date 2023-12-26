import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../../../service/websocket.service";
import { userWs } from "../../../interfaces/userWs.interface";
import { messageWs } from "../../../interfaces/messageWs.interface";
import { FormControl } from "@angular/forms";
import { RoleUser } from "../../../interfaces/roleUser.interface";
import { User } from "../../../interfaces/user.interface";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messageContent: FormControl<string|null> = new FormControl("")
  public currentMessages: Array<messageWs> = [];
  public listMessages: Array<messageWs> = [];
  private isConnected: boolean = false;
  public currentTime: Date = new Date();
  public listUsers: Array<userWs> = [];
  public currentUserName: String = "";
  public currentUuid: String = "";
  private stompClient: any;
  public userInfos!: User;

  constructor(
    private authService: AuthService,
    private wsService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.authService.userInfos().subscribe({
      next: (roleUser: RoleUser): void => {
        this.userInfos = roleUser.user;
        this.connectToWebSocket()
      }
    });
  }

  connectToWebSocket() {
    this.stompClient = this.wsService.connectWs();
    this.stompClient.connect(
      {},
      this.connectNewUser.bind(this),
      this.errorCallback.bind(this)
    );
  }

  connectNewUser(frame: any): void {
    this.isConnected = true;
    this.stompClient.subscribe(
      "/topic/messages",
      (response: any): void => {
        this.filterReceivedData(response)
      }
    );
  }

  filterReceivedData(response: any) {
    const userData = JSON.parse(response.body);
    if (userData.hasOwnProperty("content")) {
      this.listMessages.push(userData)
      this.showReceivedMessages();
    } else {
      this.listUsers.filter(
        (obj, index) => {
          if (userData.uuid == obj.uuid) {
            this.listUsers.splice(index, 1);
          }
        }
      )
      this.listUsers.push(userData);
      //this.filterConnectedUsers();
    }
  }

  filterConnectedUsers() {
    this.listUsers = this.listUsers.filter(
      (obj: userWs): boolean => obj.status
    );
  }

  errorCallback(): void {
    console.log('error callback called, socket not connected!');
    this.isConnected = false;
    this.connectToWebSocket();
  }

  showReceivedMessages(): void {
    this.filterMessage()
  }

  userClicked(_this: any, user: userWs): void {
    for (let user of this.listUsers) {
      let userDiv: HTMLElement | null = document.getElementById(user.uuid.toString());
      userDiv?.classList.remove('active-user');
    }
    this.currentUserName = user.userName;
    this.currentUuid = user.uuid;
    _this.currentTarget.classList.toggle("active-user");
    this.filterMessage();
  }

  public filterMessage(): void {
    this.currentMessages = this.listMessages.filter(
      (obj: messageWs): boolean => obj.sender == this.currentUuid
    );
  }

  sendMessage(): void {
    const content: String | null = this.messageContent.getRawValue();
    if (content?.length && content?.length > 0) {
      const chatMessage: messageWs = {
        userName: this.userInfos.name,
        sender : this.currentUuid,
        content : content,
        receiver: this.currentUuid,
        type: 'ADMIN',
        time: '',
      };
      this.listMessages.push(chatMessage)
      this.stompClient.send(
        "/app/chat/room",
        {},
        JSON.stringify(chatMessage)
      )
    }
    this.showReceivedMessages();
    this.messageContent = new FormControl("");
  }
}
