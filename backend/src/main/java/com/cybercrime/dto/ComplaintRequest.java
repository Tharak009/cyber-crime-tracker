package com.cybercrime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRequest {
    @NotNull
    private Long categoryId;
    @NotBlank
    private String crimeType;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private LocalDate incidentDate;
    private String incidentLocation;
    private String suspectReference;
    private BigDecimal amountLost;
    private String contactDetails;
}
