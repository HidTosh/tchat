package org.example.back.handler;

import org.example.back.model.User;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class TchatWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message)  throws Exception {
        // Handle incoming messages here

        String receivedMessage = (String) message.getPayload();
        System.out.println(receivedMessage);
        session.sendMessage(new TextMessage("Received: " + "bonjour que voulez vous"));
    }
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {

        System.out.println(session.getPrincipal().getName());
        // Perform actions when a new WebSocket connection is established
        System.out.println("Perform actions when a new WebSocket connection is established");
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    // Perform actions when a WebSocket connection is closed
        System.out.println("Perform actions when a WebSocket connection is closed");
    }
}
