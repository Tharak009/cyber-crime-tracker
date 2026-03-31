package com.cybercrime.service.impl;

import com.cybercrime.dto.AnnouncementRequest;
import com.cybercrime.dto.DashboardStatsDto;
import com.cybercrime.dto.UserDto;
import com.cybercrime.entity.AccountStatus;
import com.cybercrime.entity.Announcement;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.RoleName;
import com.cybercrime.entity.User;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.AnnouncementRepository;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AdminService;
import com.cybercrime.util.SecurityUtil;
import com.cybercrime.util.UserMapper;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getOfficers() {
        return userRepository.findByRoleName(RoleName.ROLE_OFFICER).stream().map(userMapper::toDto).toList();
    }

    @Override
    @Transactional
    public UserDto updateAccountStatus(Long userId, AccountStatus status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getStatistics() {
        List<Complaint> complaints = complaintRepository.findAll();
        Map<String, Long> byType = complaints.stream().collect(java.util.stream.Collectors.groupingBy(Complaint::getCrimeType, LinkedHashMap::new, java.util.stream.Collectors.counting()));
        Map<String, Long> byStatus = complaints.stream().collect(java.util.stream.Collectors.groupingBy(c -> c.getStatus().name(), LinkedHashMap::new, java.util.stream.Collectors.counting()));
        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalComplaints(complaints.size())
                .openCases(complaints.stream().filter(c -> c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED).count())
                .resolvedCases(complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count())
                .complaintsByType(byType)
                .casesByStatus(byStatus)
                .build();
    }

    @Override
    @Transactional
    public Object createAnnouncement(AnnouncementRequest request) {
        User admin = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        return announcementRepository.save(Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .published(request.isPublished())
                .createdAt(LocalDateTime.now())
                .createdBy(admin)
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<?> getPublishedAnnouncements() {
        return announcementRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayResource exportComplaintsCsv() {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             CSVPrinter printer = new CSVPrinter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8),
                     CSVFormat.DEFAULT.builder().setHeader("Complaint No", "Type", "Status", "Priority", "Citizen", "Officer", "Incident Date").build())) {
            for (Complaint complaint : complaintRepository.findAll()) {
                printer.printRecord(complaint.getComplaintNumber(), complaint.getCrimeType(), complaint.getStatus(),
                        complaint.getPriorityLevel(), complaint.getCitizen().getFullName(),
                        complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getFullName() : "-",
                        complaint.getIncidentDate());
            }
            printer.flush();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (IOException ex) {
            throw new IllegalStateException("CSV generation failed");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayResource exportComplaintsPdf() {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();
            document.add(new Paragraph("Cyber Crime Monthly Report - " + LocalDate.now()));
            for (Complaint complaint : complaintRepository.findAll()) {
                document.add(new Paragraph(complaint.getComplaintNumber() + " | " + complaint.getCrimeType() + " | " + complaint.getStatus()));
            }
            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (DocumentException ex) {
            throw new IllegalStateException("PDF generation failed");
        }
    }
}
