package com.cybercrime.service;

import com.cybercrime.dto.NotificationDto;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.NotificationType;
import com.cybercrime.entity.User;
import java.util.List;

public interface NotificationService {
    void notifyUser(User user, String title, String message, NotificationType type, Complaint complaint);
    List<NotificationDto> getCurrentUserNotifications();
    void markAsRead(Long notificationId);
}
