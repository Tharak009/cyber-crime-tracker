package com.cybercrime.repository;

import com.cybercrime.entity.CaseNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseNoteRepository extends JpaRepository<CaseNote, Long> {
    List<CaseNote> findByComplaintIdOrderByCreatedAtDesc(Long complaintId);
}
