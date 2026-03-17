package com.cybercrime.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CaseNoteDto {
    private Long id;
    private String officerName;
    private String note;
    private boolean visibleToCitizen;
    private LocalDateTime createdAt;
}
