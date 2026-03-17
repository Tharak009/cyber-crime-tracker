package com.cybercrime.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CaseNoteRequest {
    @NotBlank
    private String note;
    private boolean visibleToCitizen;
}
