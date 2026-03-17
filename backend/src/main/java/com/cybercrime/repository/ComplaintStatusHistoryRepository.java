package com.cybercrime.repository;

import com.cybercrime.entity.ComplaintStatusHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Long> {
    List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
}
