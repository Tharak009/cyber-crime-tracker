package com.cybercrime.controller.citizen;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.SupportTicketDto;
import com.cybercrime.dto.SupportTicketRequest;
import com.cybercrime.service.SupportService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
public class SupportController {
    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportTicketDto>> create(@Valid @RequestBody SupportTicketRequest request) {
        return ResponseEntity.ok(success("Support ticket created", supportService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> myTickets() {
        return ResponseEntity.ok(success("Support tickets fetched", supportService.myTickets()));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
}
