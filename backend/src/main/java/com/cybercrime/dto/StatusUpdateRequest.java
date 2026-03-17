package com.cybercrime.dto;

import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.PriorityLevel;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateRequest {
    @NotNull
    private ComplaintStatus status;
    private PriorityLevel priorityLevel;
    private String remarks;
    private String resolutionSummary;
}
