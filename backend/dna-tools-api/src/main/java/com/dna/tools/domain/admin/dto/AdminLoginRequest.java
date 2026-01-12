package com.dna.tools.domain.admin.dto;

import lombok.Getter;

@Getter
public class AdminLoginRequest {
    private String userId;
    private String userName;
    private String password;
    private String role;
}
