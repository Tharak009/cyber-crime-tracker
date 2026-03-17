package com.cybercrime.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    @Min(1)
    @Max(5)
    private Integer rating;
    @Min(1)
    @Max(5)
    private Integer satisfactionScore;
    @NotBlank
    private String comment;
}
