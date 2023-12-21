import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/services/auth.service";
import { RoleUser } from "../../interfaces/roleUser.interface";
import { WebsocketService } from "../../service/websocket.service";
import { v4 as uuidv4 } from 'uuid';
import { FormControl } from "@angular/forms";
import { User } from "../../interfaces/user.interface";
import {messageWs} from "../../interfaces/messageWs.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public messageContent: FormControl<string|null> = new FormControl("")
  public welcomeMessage: String = "Bonjour comment puis-je vous aider";
  public currentUserName: String = "Anonymous"
  public isVisibleModalChat: Boolean = true;
  public isClientOrProspect: Boolean = true;
  public currentTime: Date = new Date();
  private isConnected: boolean = false;
  public uniqueUserId!: String;
  private stompClient!: any;
  public userInfos!: User;
  public listMessages: Array<messageWs> = [];

  constructor(
    private authService: AuthService,
    private wsService: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.getUserInfosAndConnectWebSocket();
    this.uniqueUserId = uuidv4();
  }

  getUserInfosAndConnectWebSocket(): void {
    this.authService.userInfos().subscribe({
      next: (roleUser: RoleUser): void => {
        this.currentUserName = roleUser.user.name;
        this.userInfos = roleUser.user;
        this.connectToWebSocket()
        if (roleUser.authority != "ROLE_USER") {
          this.isClientOrProspect = false;
        }
      },
      error: (): void => {
        this.connectToWebSocket();
      },
    });
  }

  connectToWebSocket(): void {
    this.stompClient = this.wsService.connectWs();
    this.stompClient.connect(
      {},
      this.connectUserThenSubscribe.bind(this),
      this.errorCallback.bind(this)
    );
  }

  connectUserThenSubscribe(frame: any): void {
    this.isConnected = true;
    const newUser: string = JSON.stringify({
      user_id: this.userInfos ? this.userInfos.id : 0,
      uuid: this.uniqueUserId,
      userName: this.userInfos ? this.userInfos.name: "anonymous",
      type: this.userInfos ? "CLIENT" : "PROSPECT",
      status: 1,
    })
    this.stompClient.send(
      "/app/chat.newUser",
      {},
      newUser
    )
    this.subscribeUserToHisQueue();
  }

  subscribeUserToHisQueue(): void {
    const endPoint: String = `/queue/user/${this.uniqueUserId}/queue/messages`;
    this.stompClient.subscribe(
      endPoint,
      (msgReceived: any): void => {
        const parsedMessage = JSON.parse(msgReceived.body);
        this.listMessages.push(parsedMessage);
      }
    )
  }

  errorCallback(): void {
    console.warn('error callback called, socket not connected!');
    this.isConnected = false;
    this.connectToWebSocket();
  }

  sendMessage(): void {
    const content: String | null = this.messageContent.getRawValue();
    if (content?.length && content?.length > 0) {
      const chatMessage: messageWs = {
        userName: this.userInfos ? this.userInfos.name: "anonymous",
        sender : this.uniqueUserId,
        receiver: "support",
        content : content,
        type: 'this.userInfos ? "CLIENT" : "PROSPECT"',
        time: '',
      };
      if (this.stompClient != null && this.isConnected) {
        this.stompClient.send(
          "/app/chat.sendMessage",
          {},
          JSON.stringify(chatMessage)
        );
        this.listMessages.push(chatMessage)
        this.messageContent = new FormControl("")
      } else {
        console.log('socket not connected');
      }
    }
  }

  public chatOpen() {
    this.isVisibleModalChat = !this.isVisibleModalChat;
  }
}
