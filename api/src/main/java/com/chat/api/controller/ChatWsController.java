package com.chat.api.controller;

import com.chat.api.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class ChatWsController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.newUser")
    @SendTo("/topic/messages")
    public UserInfosWsDto newUser(
        @Payload UserInfosWsDto user,
        SimpMessageHeaderAccessor messageHeader
    ) {
        // Set username in web socket session
        messageHeader.getSessionAttributes().put("username", user.getUserName());
        messageHeader.getSessionAttributes().put("uuid", user.getUuid());
        messageHeader.getSessionAttributes().put("user_id", user.getUser_id());
        messageHeader.getSessionAttributes().put("type", user.getType());

        return user;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/messages")
    public MessageWsDto send(MessageWsDto message) throws Exception {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();

        String time = new SimpleDateFormat("HH:mm").format(new Date());
        return new MessageWsDto(
            message.getUserName(),
            message.getSender(),
            message.getReceiver(),
            message.getContent(),
            message.getType(),
            dtf.format(now)
        );
    }

    @MessageMapping("/chat/room")
    public void sendSpecific(
        @Payload MessageWsDto msg,
        Principal user,
        @Header("simpSessionId") String sessionId
    ) throws Exception {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();

        msg.setLocalDateTime(dtf.format(now));

        simpMessagingTemplate.convertAndSendToUser(
            msg.getReceiver(), "/queue/messages", msg
        );
    }
}
