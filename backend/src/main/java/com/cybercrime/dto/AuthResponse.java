package com.cybercrime.dto;

import com.cybercrime.entity.RoleName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String token;
    private String refreshHint;
    private Long userId;
    private String fullName;
    private String email;
    private RoleName role;
}
