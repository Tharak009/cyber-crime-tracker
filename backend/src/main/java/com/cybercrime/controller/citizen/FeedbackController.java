package com.cybercrime.controller.citizen;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.FeedbackRequest;
import com.cybercrime.service.FeedbackService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<Void>> submit(@PathVariable Long complaintId, @Valid @RequestBody FeedbackRequest request) {
        feedbackService.submitFeedback(complaintId, request);
        return ResponseEntity.ok(success("Feedback submitted", null));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
}
