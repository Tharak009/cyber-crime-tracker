package com.cybercrime.controller.admin;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.service.AdminService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
    private final AdminService adminService;

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Object>> published() {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Announcements fetched")
                .data(adminService.getPublishedAnnouncements())
                .timestamp(LocalDateTime.now())
                .build());
    }
}
