package com.cybercrime.service.impl;

import com.cybercrime.dto.ComplaintRequest;
import com.cybercrime.dto.ComplaintResponse;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.ComplaintStatusHistory;
import com.cybercrime.entity.CrimeCategory;
import com.cybercrime.entity.NotificationType;
import com.cybercrime.entity.PriorityLevel;
import com.cybercrime.entity.User;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.CaseNoteRepository;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.ComplaintStatusHistoryRepository;
import com.cybercrime.repository.CrimeCategoryRepository;
import com.cybercrime.repository.EvidenceFileRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuditService;
import com.cybercrime.service.ComplaintService;
import com.cybercrime.service.MailService;
import com.cybercrime.service.NotificationService;
import com.cybercrime.util.MapperUtil;
import com.cybercrime.util.SecurityUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final CrimeCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final EvidenceFileRepository evidenceFileRepository;
    private final CaseNoteRepository caseNoteRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final AuditService auditService;

    @Override
    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request) {
        User citizen = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CrimeCategory category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Complaint complaint = complaintRepository.save(Complaint.builder()
                .complaintNumber("CC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .category(category)
                .crimeType(request.getCrimeType())
                .title(request.getTitle())
                .description(request.getDescription())
                .incidentDate(request.getIncidentDate())
                .incidentLocation(request.getIncidentLocation())
                .suspectReference(request.getSuspectReference())
                .amountLost(request.getAmountLost())
                .contactDetails(request.getContactDetails())
                .priorityLevel(PriorityLevel.MEDIUM)
                .status(ComplaintStatus.SUBMITTED)
                .citizen(citizen)
                .build());
        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(complaint)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint submitted")
                .updatedBy(citizen)
                .createdAt(LocalDateTime.now())
                .build());
        notificationService.notifyUser(citizen, "Complaint submitted", "Your complaint " + complaint.getComplaintNumber() + " has been submitted successfully.", NotificationType.COMPLAINT_SUBMITTED, complaint);
        mailService.sendMail(citizen.getEmail(), "Complaint submitted", "Complaint " + complaint.getComplaintNumber() + " has been received.");
        auditService.log("CREATE", "Complaint", String.valueOf(complaint.getId()), "Complaint created");
        return getComplaint(complaint.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getCurrentUserComplaints() {
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(user.getId()).stream().map(this::mapResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        return mapResponse(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> search(String complaintNumber, String crimeType, String status, String priority, Long officerId, LocalDate fromDate, LocalDate toDate) {
        ComplaintStatus complaintStatus = hasText(status) ? ComplaintStatus.valueOf(status.trim()) : null;
        PriorityLevel priorityLevel = hasText(priority) ? PriorityLevel.valueOf(priority.trim()) : null;
        Specification<Complaint> specification = (root, query, criteriaBuilder) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (hasText(complaintNumber)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("complaintNumber")),
                        contains(complaintNumber)));
            }

            if (hasText(crimeType)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("crimeType")),
                        contains(crimeType)));
            }

            if (complaintStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), complaintStatus));
            }

            if (priorityLevel != null) {
                predicates.add(criteriaBuilder.equal(root.get("priorityLevel"), priorityLevel));
            }

            if (officerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("assignedOfficer").get("id"), officerId));
            }

            if (fromDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("incidentDate"), fromDate));
            }

            if (toDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("incidentDate"), toDate));
            }

            return criteriaBuilder.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
        };

        return complaintRepository.findAll(specification, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(this::mapResponse).toList();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String contains(String value) {
        return "%" + value.trim().toLowerCase() + "%";
    }

    private ComplaintResponse mapResponse(Complaint complaint) {
        return MapperUtil.toComplaintResponse(
                complaint,
                historyRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId()).stream().map(MapperUtil::toStatusDto).toList(),
                evidenceFileRepository.findByComplaintIdOrderByCreatedAtDesc(complaint.getId()).stream().map(MapperUtil::toEvidenceDto).toList(),
                caseNoteRepository.findByComplaintIdOrderByCreatedAtDesc(complaint.getId()).stream().map(MapperUtil::toCaseNoteDto).toList()
        );
    }
}
