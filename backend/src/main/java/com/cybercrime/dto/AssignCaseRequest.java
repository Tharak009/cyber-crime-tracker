package com.cybercrime.dto;

import com.cybercrime.entity.PriorityLevel;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignCaseRequest {
    @NotNull
    private Long complaintId;
    @NotNull
    private Long officerId;
    @NotNull
    private PriorityLevel priorityLevel;
    private String remarks;
}
