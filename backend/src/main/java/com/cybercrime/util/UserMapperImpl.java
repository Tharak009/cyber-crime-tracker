package com.cybercrime.util;

import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .build();
    }
}
