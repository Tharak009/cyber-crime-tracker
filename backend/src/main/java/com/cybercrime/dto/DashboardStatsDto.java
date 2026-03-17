package com.cybercrime.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardStatsDto {
    private long totalUsers;
    private long totalComplaints;
    private long openCases;
    private long resolvedCases;
    private Map<String, Long> complaintsByType;
    private Map<String, Long> casesByStatus;
}
