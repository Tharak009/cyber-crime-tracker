package com.cybercrime.controller.officer;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.AssignCaseRequest;
import com.cybercrime.dto.CaseNoteDto;
import com.cybercrime.dto.CaseNoteRequest;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.dto.StatusUpdateRequest;
import com.cybercrime.service.CaseService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cases")
@RequiredArgsConstructor
public class CaseController {
    private final CaseService caseService;

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assign(@Valid @RequestBody AssignCaseRequest request) {
        return ResponseEntity.ok(success("Case assigned", caseService.assignCase(request)));
    }

    @PutMapping("/update-status/{complaintId}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(@PathVariable Long complaintId, @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(success("Status updated", caseService.updateStatus(complaintId, request)));
    }

    @PostMapping("/{complaintId}/notes")
    public ResponseEntity<ApiResponse<CaseNoteDto>> addNote(@PathVariable Long complaintId, @Valid @RequestBody CaseNoteRequest request) {
        return ResponseEntity.ok(success("Case note added", caseService.addNote(complaintId, request)));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> assignedCases() {
        return ResponseEntity.ok(success("Assigned cases fetched", caseService.getAssignedCases()));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).timestamp(LocalDateTime.now()).build();
    }
}
