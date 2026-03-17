package com.cybercrime.service;

import com.cybercrime.dto.AnnouncementRequest;
import com.cybercrime.dto.DashboardStatsDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.AccountStatus;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;

public interface AdminService {
    List<UserDto> getUsers();
    List<UserDto> getOfficers();
    UserDto updateAccountStatus(Long userId, AccountStatus status);
    DashboardStatsDto getStatistics();
    Object createAnnouncement(AnnouncementRequest request);
    List<?> getPublishedAnnouncements();
    ByteArrayResource exportComplaintsCsv();
    ByteArrayResource exportComplaintsPdf();
}
