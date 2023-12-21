package com.chat.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfosWsDto {
    private Integer user_id;
    private String uuid;
    private String userName;
    private String type;
    private Boolean status;
}
