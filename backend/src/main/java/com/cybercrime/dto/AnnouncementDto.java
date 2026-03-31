package com.cybercrime.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AnnouncementDto {
    Long id;
    String title;
    String content;
    boolean published;
    LocalDateTime createdAt;
}
