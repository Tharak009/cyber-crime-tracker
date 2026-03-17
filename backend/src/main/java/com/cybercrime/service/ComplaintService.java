package com.cybercrime.service;

import com.cybercrime.dto.ComplaintRequest;
import com.cybercrime.dto.ComplaintResponse;
import java.time.LocalDate;
import java.util.List;

public interface ComplaintService {
    ComplaintResponse createComplaint(ComplaintRequest request);
    List<ComplaintResponse> getCurrentUserComplaints();
    ComplaintResponse getComplaint(Long id);
    List<ComplaintResponse> search(String complaintNumber, String crimeType, String status, String priority, Long officerId, LocalDate fromDate, LocalDate toDate);
}
