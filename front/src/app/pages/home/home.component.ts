import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/services/auth.service";
import {RoleUser} from "../../interfaces/roleUser.interface";
import {CompatClient, Stomp} from '@stomp/stompjs';
import * as SockJS from "sockjs-client";
import { WebsocketService } from "../../service/websocket.service";
import { RxStomp } from "@stomp/rx-stomp";
import { v4 as uuidv4 } from 'uuid';
import {AuthSuccess} from "../../auth/interfaces/authSuccess.interface";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isVisibleModalChat: Boolean = false;
  public currentUserName: String = ""
  private prospectRole: String = "ROLE_USER"
  public isClientOrProspect: Boolean = true;
  public currentTime: Date = new Date();
  public userInfos!: RoleUser;
  private stompClient: any;
  private isConnected: boolean = false;
  public messageContent: FormControl<string|null> = new FormControl("")

  longText = `Bonjour, comment allez-vous`;

  constructor(
    private authService: AuthService,
    private wsService: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.authService.userInfos().subscribe({
      next: (userData: RoleUser): void => {
        this.currentUserName = userData.user.name;
        this.userInfos = userData;
        this.connectToWebSocket()
        if (this.prospectRole != "ROLE_USER") {
          this.isClientOrProspect = false;
        }
      },
      error: (): void => {
        this.connectToWebSocket();
      },
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
    const user_id: number = this.userInfos ? this.userInfos.user.id : 0;
    const userName: String = this.userInfos ? this.userInfos.user.name: "anonymous";
    const type: String = this.userInfos ? "CLIENT" : "PROSPECT"
    this.isConnected = true;

    this.stompClient.send("/app/chat.newUser", {}, JSON.stringify({
        user_id: user_id,
        uuid: uuidv4().toString(),
        username: userName,
        type: type,
        status: 1,
      }))
  }

  errorCallback(): void {
    console.log('error callback called, socket not connected!');
    this.isConnected = false;
    this.connectToWebSocket;
  }

  sendMessage(): void {
    const userName: String = this.userInfos ? this.userInfos.user.name: "anonymous";
    const type: String = this.userInfos ? "CLIENT" : "PROSPECT"

    var chatMessage = {
      sender : userName,
      content : this.messageContent.getRawValue(),
      receiver: "support",
      type: 'CHAT'
    };

    if (this.stompClient != null && this.isConnected) {
      this.stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON
          .stringify(chatMessage)
      );
    } else {
      console.log('socket not connected');
    }
  }

  public chatOpen() {
    this.isVisibleModalChat = !this.isVisibleModalChat;
  }
}
