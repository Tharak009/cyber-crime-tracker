package com.cybercrime.util;

import com.cybercrime.dto.CaseNoteDto;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.dto.EvidenceFileDto;
import com.cybercrime.dto.NotificationDto;
import com.cybercrime.dto.StatusHistoryDto;
import com.cybercrime.dto.SupportTicketDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.CaseNote;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.ComplaintStatusHistory;
import com.cybercrime.entity.EvidenceFile;
import com.cybercrime.entity.Notification;
import com.cybercrime.entity.SupportTicket;
import com.cybercrime.entity.User;
import java.util.List;

public final class MapperUtil {
    private MapperUtil() {
    }

    public static UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .role(user.getRole().getName())
                .build();
    }

    public static ComplaintResponse toComplaintResponse(Complaint complaint, List<StatusHistoryDto> timeline, List<EvidenceFileDto> evidenceFiles, List<CaseNoteDto> notes) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .complaintNumber(complaint.getComplaintNumber())
                .category(complaint.getCategory() != null ? complaint.getCategory().getName() : null)
                .crimeType(complaint.getCrimeType())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .incidentDate(complaint.getIncidentDate())
                .incidentLocation(complaint.getIncidentLocation())
                .suspectReference(complaint.getSuspectReference())
                .amountLost(complaint.getAmountLost())
                .contactDetails(complaint.getContactDetails())
                .status(complaint.getStatus())
                .priorityLevel(complaint.getPriorityLevel())
                .citizenName(complaint.getCitizen().getFullName())
                .assignedOfficerName(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getFullName() : null)
                .resolutionSummary(complaint.getResolutionSummary())
                .createdAt(complaint.getCreatedAt())
                .timeline(timeline)
                .evidenceFiles(evidenceFiles)
                .notes(notes)
                .build();
    }

    public static StatusHistoryDto toStatusDto(ComplaintStatusHistory history) {
        return StatusHistoryDto.builder()
                .status(history.getStatus())
                .remarks(history.getRemarks())
                .updatedBy(history.getUpdatedBy() != null ? history.getUpdatedBy().getFullName() : "System")
                .createdAt(history.getCreatedAt())
                .build();
    }

    public static EvidenceFileDto toEvidenceDto(EvidenceFile file) {
        return EvidenceFileDto.builder()
                .id(file.getId())
                .originalName(file.getOriginalName())
                .contentType(file.getContentType())
                .fileSize(file.getFileSize())
                .createdAt(file.getCreatedAt())
                .build();
    }

    public static CaseNoteDto toCaseNoteDto(CaseNote note) {
        return CaseNoteDto.builder()
                .id(note.getId())
                .officerName(note.getOfficer().getFullName())
                .note(note.getNote())
                .visibleToCitizen(note.isVisibleToCitizen())
                .createdAt(note.getCreatedAt())
                .build();
    }

    public static NotificationDto toNotificationDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .complaintId(notification.getComplaint() != null ? notification.getComplaint().getId() : null)
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public static SupportTicketDto toSupportTicketDto(SupportTicket ticket) {
        return SupportTicketDto.builder()
                .id(ticket.getId())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
