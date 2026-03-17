package com.cybercrime.dto;

import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.PriorityLevel;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ComplaintResponse {
    private Long id;
    private String complaintNumber;
    private String category;
    private String crimeType;
    private String title;
    private String description;
    private LocalDate incidentDate;
    private String incidentLocation;
    private String suspectReference;
    private BigDecimal amountLost;
    private String contactDetails;
    private ComplaintStatus status;
    private PriorityLevel priorityLevel;
    private String citizenName;
    private String assignedOfficerName;
    private String resolutionSummary;
    private LocalDateTime createdAt;
    private List<StatusHistoryDto> timeline;
    private List<EvidenceFileDto> evidenceFiles;
    private List<CaseNoteDto> notes;
}
