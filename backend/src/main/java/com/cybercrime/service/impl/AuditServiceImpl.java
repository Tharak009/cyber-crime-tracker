package com.cybercrime.service.impl;

import com.cybercrime.entity.AuditLog;
import com.cybercrime.entity.User;
import com.cybercrime.repository.AuditLogRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuditService;
import com.cybercrime.util.SecurityUtil;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void log(String action, String entityName, String entityId, String details) {
        String email = SecurityUtil.currentUsername();
        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        auditLogRepository.save(AuditLog.builder()
                .user(user)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build());
    }
}
