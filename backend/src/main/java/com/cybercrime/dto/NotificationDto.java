package com.cybercrime.dto;

import com.cybercrime.entity.NotificationType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private Long complaintId;
    private LocalDateTime createdAt;
}
