package com.chat.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageWsDto {
    private String userName;
    private String sender;
    private String receiver;
    private String content;
    private String type;
    private String LocalDateTime;
}
