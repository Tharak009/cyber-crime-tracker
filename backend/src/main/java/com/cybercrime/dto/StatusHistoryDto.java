package com.cybercrime.dto;

import com.cybercrime.entity.ComplaintStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatusHistoryDto {
    private ComplaintStatus status;
    private String remarks;
    private String updatedBy;
    private LocalDateTime createdAt;
}
