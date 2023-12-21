package com.chat.api.handler;

import com.chat.api.dto.MessageWsDto;
import com.chat.api.dto.UserInfosWsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Component
public class WebSocketChatEventListener {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        System.out.println("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> userInfos = headerAccessor.getSessionAttributes();

        String username = (String) userInfos.get("username");

        if(username != null) {

            UserInfosWsDto user = new UserInfosWsDto(
                (Integer) userInfos.get("user_id"),
                (String) userInfos.get("uuid"),
                username,
                (String) userInfos.get("type"),
                false
            );
/*
            private Integer user_id;
            private String Uuid;
            private String Username;
            private String type;
            */

            //user.setStatus(false);

            messagingTemplate.convertAndSend("/topic/messages", user);
        }
    }
}
