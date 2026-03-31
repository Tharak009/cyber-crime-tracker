package com.cybercrime.service;

import com.cybercrime.dto.AnnouncementRequest;
import com.cybercrime.dto.AnnouncementDto;
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
    AnnouncementDto createAnnouncement(AnnouncementRequest request);
    List<AnnouncementDto> getPublishedAnnouncements();
    ByteArrayResource exportComplaintsCsv();
    ByteArrayResource exportComplaintsPdf();
}
