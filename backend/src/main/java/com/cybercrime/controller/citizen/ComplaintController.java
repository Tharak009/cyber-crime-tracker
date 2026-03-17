package com.cybercrime.controller.citizen;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.ComplaintRequest;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.service.ComplaintService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ComplaintResponse>> create(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(success("Complaint created", complaintService.createComplaint(request)));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> userComplaints() {
        return ResponseEntity.ok(success("Complaints fetched", complaintService.getCurrentUserComplaints()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(success("Complaint fetched", complaintService.getComplaint(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> search(@RequestParam(required = false) String complaintNumber,
                                                                      @RequestParam(required = false) String crimeType,
                                                                      @RequestParam(required = false) String status,
                                                                      @RequestParam(required = false) String priority,
                                                                      @RequestParam(required = false) Long officerId,
                                                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(success("Search results", complaintService.search(complaintNumber, crimeType, status, priority, officerId, fromDate, toDate)));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
}
