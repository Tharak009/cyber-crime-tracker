package com.cybercrime.dto;

import com.cybercrime.entity.TicketStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SupportTicketDto {
    private Long id;
    private String subject;
    private String message;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
