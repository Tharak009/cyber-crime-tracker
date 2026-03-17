package com.cybercrime.util;

import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.User;
public interface UserMapper {
    UserDto toDto(User user);
}
