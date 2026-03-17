package com.cybercrime.dto;

import com.cybercrime.entity.AccountStatus;
import com.cybercrime.entity.RoleName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private AccountStatus status;
    private boolean emailVerified;
    private RoleName role;
}
