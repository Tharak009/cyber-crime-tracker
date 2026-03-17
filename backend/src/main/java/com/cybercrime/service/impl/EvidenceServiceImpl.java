package com.cybercrime.service.impl;

import com.cybercrime.dto.EvidenceFileDto;
import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.EvidenceFile;
import com.cybercrime.entity.User;
import com.cybercrime.exception.BadRequestException;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.EvidenceFileRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.AuditService;
import com.cybercrime.service.EvidenceService;
import com.cybercrime.util.MapperUtil;
import com.cybercrime.util.SecurityUtil;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EvidenceServiceImpl implements EvidenceService {
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "video/mp4"
    );
    private static final long MAX_SIZE = 25L * 1024 * 1024;

    @Value("${app.file-storage-path}")
    private String storagePath;

    private final ComplaintRepository complaintRepository;
    private final EvidenceFileRepository evidenceFileRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Override
    public List<EvidenceFileDto> upload(Long complaintId, MultipartFile[] files) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            Path root = Paths.get(storagePath).toAbsolutePath().normalize();
            Files.createDirectories(root);
            for (MultipartFile file : files) {
                validate(file);
                String storedName = UUID.randomUUID() + "-" + file.getOriginalFilename();
                Path target = root.resolve(storedName);
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                evidenceFileRepository.save(EvidenceFile.builder()
                        .complaint(complaint)
                        .uploadedBy(user)
                        .originalName(file.getOriginalFilename())
                        .storedName(storedName)
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .filePath(target.toString())
                        .createdAt(LocalDateTime.now())
                        .build());
            }
            auditService.log("UPLOAD_EVIDENCE", "Complaint", String.valueOf(complaintId), files.length + " files uploaded");
            return evidenceFileRepository.findByComplaintIdOrderByCreatedAtDesc(complaintId).stream().map(MapperUtil::toEvidenceDto).toList();
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store evidence files");
        }
    }

    @Override
    public Resource download(Long evidenceId) {
        EvidenceFile file = evidenceFileRepository.findById(evidenceId).orElseThrow(() -> new ResourceNotFoundException("Evidence not found"));
        return new FileSystemResource(file.getFilePath());
    }

    private void validate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BadRequestException("File size exceeds 25 MB");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Unsupported file format");
        }
    }
}
