package com.cybercrime.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketRequest {
    @NotBlank
    private String subject;
    @NotBlank
    private String message;
}
