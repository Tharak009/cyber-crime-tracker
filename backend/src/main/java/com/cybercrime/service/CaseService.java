package com.cybercrime.service;

import com.cybercrime.dto.AssignCaseRequest;
import com.cybercrime.dto.CaseNoteDto;
import com.cybercrime.dto.CaseNoteRequest;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.dto.StatusUpdateRequest;
import java.util.List;

public interface CaseService {
    ComplaintResponse assignCase(AssignCaseRequest request);
    ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request);
    CaseNoteDto addNote(Long complaintId, CaseNoteRequest request);
    List<ComplaintResponse> getAssignedCases();
}
