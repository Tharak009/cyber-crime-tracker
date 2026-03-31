package com.cybercrime.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CrimeCategoryDto {
    Long id;
    String name;
    String description;
}
