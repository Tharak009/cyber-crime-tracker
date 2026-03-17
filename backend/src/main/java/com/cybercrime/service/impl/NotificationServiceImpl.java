package com.cybercrime.service.impl;

import com.cybercrime.dto.NotificationDto;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.Notification;
import com.cybercrime.entity.NotificationType;
import com.cybercrime.entity.User;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.NotificationRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.NotificationService;
import com.cybercrime.util.MapperUtil;
import com.cybercrime.util.SecurityUtil;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyUser(User user, String title, String message, NotificationType type, Complaint complaint) {
        Notification notification = notificationRepository.save(Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .complaint(complaint)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build());
        messagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/notifications", MapperUtil.toNotificationDto(notification));
    }

    @Override
    public List<NotificationDto> getCurrentUserNotifications() {
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(MapperUtil::toNotificationDto).toList();
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
