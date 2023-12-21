import { Injectable } from '@angular/core';
import {CompatClient, Stomp} from '@stomp/stompjs';
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor() { }

  public connectWs(): CompatClient {
    let socket: WebSocket = new SockJS('http://localhost:3001/ws-api');
    return Stomp.over(socket);
  }
}
