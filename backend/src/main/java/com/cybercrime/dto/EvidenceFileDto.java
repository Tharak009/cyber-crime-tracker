package com.cybercrime.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EvidenceFileDto {
    private Long id;
    private String originalName;
    private String contentType;
    private Long fileSize;
    private LocalDateTime createdAt;
}
