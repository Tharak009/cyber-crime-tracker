package com.cybercrime.service.impl;

import com.cybercrime.dto.AuthRequest;
import com.cybercrime.dto.AuthResponse;
import com.cybercrime.dto.ChangePasswordRequest;
import com.cybercrime.dto.ForgotPasswordRequest;
import com.cybercrime.dto.RegisterRequest;
import com.cybercrime.dto.ResetPasswordRequest;
import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.AccountStatus;
import com.cybercrime.entity.Role;
import com.cybercrime.entity.RoleName;
import com.cybercrime.entity.User;
import com.cybercrime.exception.BadRequestException;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.RoleRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.security.JwtService;
import com.cybercrime.service.AuditService;
import com.cybercrime.service.AuthService;
import com.cybercrime.service.MailService;
import com.cybercrime.util.SecurityUtil;
import com.cybercrime.util.UserMapper;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MailService mailService;
    private final AuditService auditService;
    private final UserMapper userMapper;

    @Override
    public UserDto register(RegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new BadRequestException("Email already registered");
        });
        RoleName roleName = request.getRole() == null ? RoleName.ROLE_CITIZEN : request.getRole();
        if (roleName != RoleName.ROLE_CITIZEN) {
            throw new BadRequestException("Public registration is available for citizens only");
        }
        Role role = roleRepository.findByName(roleName).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        User saved = userRepository.save(User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(AccountStatus.ACTIVE)
                .emailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .role(role)
                .build());
        mailService.sendMail(saved.getEmail(), "Verify your account", "Verification token: " + saved.getVerificationToken());
        auditService.log("REGISTER", "User", String.valueOf(saved.getId()), "New account created");
        return userMapper.toDto(saved);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        auditService.log("LOGIN", "User", String.valueOf(user.getId()), "User logged in");
        return AuthResponse.builder()
                .token(jwtService.generateToken(org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                        .password(user.getPassword()).authorities(user.getRole().getName().name()).build()))
                .refreshHint("Re-authenticate when the JWT expires")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setResetToken(UUID.randomUUID().toString());
        userRepository.save(user);
        mailService.sendMail(user.getEmail(), "Password reset", "Reset token: " + user.getResetToken());
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken()).orElseThrow(() -> new ResourceNotFoundException("Invalid reset token"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        userRepository.save(user);
    }

    @Override
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token).orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    @Override
    public UserDto getProfile() {
        return userMapper.toDto(currentUser());
    }

    @Override
    public UserDto updateProfile(UserDto request) {
        User user = currentUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User currentUser() {
        return userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
