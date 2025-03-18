package com.globify.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PasswordUpdateRequest {
    private String token;
    private String newPassword;

}
