package com.cybercrime.repository;

import com.cybercrime.entity.EvidenceFile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvidenceFileRepository extends JpaRepository<EvidenceFile, Long> {
    List<EvidenceFile> findByComplaintIdOrderByCreatedAtDesc(Long complaintId);
}
