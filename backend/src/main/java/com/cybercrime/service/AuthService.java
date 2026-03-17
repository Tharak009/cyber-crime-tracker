package com.cybercrime.service;

import com.cybercrime.dto.AuthRequest;
import com.cybercrime.dto.AuthResponse;
import com.cybercrime.dto.ChangePasswordRequest;
import com.cybercrime.dto.ForgotPasswordRequest;
import com.cybercrime.dto.RegisterRequest;
import com.cybercrime.dto.ResetPasswordRequest;
import com.cybercrime.dto.UserDto;

public interface AuthService {
    UserDto register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void verifyEmail(String token);
    UserDto getProfile();
    UserDto updateProfile(UserDto request);
    void changePassword(ChangePasswordRequest request);
}
