package com.cybercrime.service.impl;

import com.cybercrime.dto.AssignCaseRequest;
import com.cybercrime.dto.CaseNoteDto;
import com.cybercrime.dto.CaseNoteRequest;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.dto.StatusUpdateRequest;
import com.cybercrime.entity.CaseNote;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.ComplaintStatusHistory;
import com.cybercrime.entity.NotificationType;
import com.cybercrime.entity.User;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.CaseNoteRepository;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.ComplaintStatusHistoryRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuditService;
import com.cybercrime.service.CaseService;
import com.cybercrime.service.ComplaintService;
import com.cybercrime.service.MailService;
import com.cybercrime.service.NotificationService;
import com.cybercrime.util.MapperUtil;
import com.cybercrime.util.SecurityUtil;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CaseServiceImpl implements CaseService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final CaseNoteRepository noteRepository;
    private final ComplaintService complaintService;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final AuditService auditService;

    @Override
    public ComplaintResponse assignCase(AssignCaseRequest request) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId()).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User officer = userRepository.findById(request.getOfficerId()).orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
        complaint.setAssignedOfficer(officer);
        complaint.setPriorityLevel(request.getPriorityLevel());
        complaint.setStatus(ComplaintStatus.ASSIGNED_TO_OFFICER);
        complaintRepository.save(complaint);
        saveHistory(complaint, ComplaintStatus.ASSIGNED_TO_OFFICER, request.getRemarks());
        notificationService.notifyUser(officer, "New case assigned", "Complaint " + complaint.getComplaintNumber() + " has been assigned to you.", NotificationType.CASE_ASSIGNED, complaint);
        notificationService.notifyUser(complaint.getCitizen(), "Case assigned", "Your complaint has been assigned to an officer.", NotificationType.CASE_ASSIGNED, complaint);
        mailService.sendMail(complaint.getCitizen().getEmail(), "Case assigned", "Complaint " + complaint.getComplaintNumber() + " has been assigned.");
        auditService.log("ASSIGN", "Complaint", String.valueOf(complaint.getId()), "Assigned to officer " + officer.getId());
        return complaintService.getComplaint(complaint.getId());
    }

    @Override
    public ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(request.getStatus());
        if (request.getPriorityLevel() != null) {
            complaint.setPriorityLevel(request.getPriorityLevel());
        }
        if (request.getResolutionSummary() != null) {
            complaint.setResolutionSummary(request.getResolutionSummary());
        }
        complaintRepository.save(complaint);
        saveHistory(complaint, request.getStatus(), request.getRemarks());
        notificationService.notifyUser(complaint.getCitizen(), "Case status updated",
                "Complaint " + complaint.getComplaintNumber() + " is now " + request.getStatus().name().replace('_', ' ') + ".",
                request.getStatus() == ComplaintStatus.EVIDENCE_REQUESTED ? NotificationType.EVIDENCE_REQUESTED : NotificationType.CASE_STATUS_UPDATED,
                complaint);
        mailService.sendMail(complaint.getCitizen().getEmail(), "Case status updated", "Complaint " + complaint.getComplaintNumber() + " status: " + request.getStatus());
        auditService.log("UPDATE_STATUS", "Complaint", String.valueOf(complaint.getId()), request.getStatus().name());
        return complaintService.getComplaint(complaintId);
    }

    @Override
    public CaseNoteDto addNote(Long complaintId, CaseNoteRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User officer = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
        CaseNote note = noteRepository.save(CaseNote.builder()
                .complaint(complaint)
                .officer(officer)
                .note(request.getNote())
                .visibleToCitizen(request.isVisibleToCitizen())
                .createdAt(LocalDateTime.now())
                .build());
        notificationService.notifyUser(complaint.getCitizen(), "Investigation update", "A new update has been added to your case.", NotificationType.INVESTIGATION_UPDATED, complaint);
        auditService.log("ADD_NOTE", "CaseNote", String.valueOf(note.getId()), "Complaint " + complaintId);
        return MapperUtil.toCaseNoteDto(note);
    }

    @Override
    public List<ComplaintResponse> getAssignedCases() {
        User officer = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
        return complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officer.getId()).stream().map(complaint -> complaintService.getComplaint(complaint.getId())).toList();
    }

    private void saveHistory(Complaint complaint, ComplaintStatus status, String remarks) {
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElse(null);
        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(complaint)
                .status(status)
                .remarks(remarks)
                .updatedBy(user)
                .createdAt(LocalDateTime.now())
                .build());
    }
}
