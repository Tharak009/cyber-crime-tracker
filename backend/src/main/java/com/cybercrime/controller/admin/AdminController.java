package com.cybercrime.controller.admin;

import com.cybercrime.dto.AnnouncementRequest;
import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.DashboardStatsDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.AccountStatus;
import com.cybercrime.service.AdminService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> users() {
        return ResponseEntity.ok(success("Users fetched", adminService.getUsers()));
    }

    @GetMapping("/officers")
    public ResponseEntity<ApiResponse<List<UserDto>>> officers() {
        return ResponseEntity.ok(success("Officers fetched", adminService.getOfficers()));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateStatus(@PathVariable Long userId, @RequestParam AccountStatus status) {
        return ResponseEntity.ok(success("Status updated", adminService.updateAccountStatus(userId, status)));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> stats() {
        return ResponseEntity.ok(success("Statistics fetched", adminService.getStatistics()));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Object>> createAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(success("Announcement published", adminService.createAnnouncement(request)));
    }

    @GetMapping("/reports/csv")
    public ResponseEntity<ByteArrayResource> csv() {
        ByteArrayResource resource = adminService.exportComplaintsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cyber-crime-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/reports/pdf")
    public ResponseEntity<ByteArrayResource> pdf() {
        ByteArrayResource resource = adminService.exportComplaintsPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cyber-crime-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
}
