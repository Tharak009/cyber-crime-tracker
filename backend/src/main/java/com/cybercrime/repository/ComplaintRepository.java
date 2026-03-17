package com.cybercrime.repository;

import com.cybercrime.entity.Complaint;
import com.cybercrime.entity.ComplaintStatus;
import com.cybercrime.entity.PriorityLevel;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);

    @Query("""
            select c from Complaint c
            where (:complaintNumber is null or lower(c.complaintNumber) like lower(concat('%', :complaintNumber, '%')))
              and (:crimeType is null or lower(c.crimeType) like lower(concat('%', :crimeType, '%')))
              and (:status is null or c.status = :status)
              and (:priority is null or c.priorityLevel = :priority)
              and (:officerId is null or c.assignedOfficer.id = :officerId)
              and (:fromDate is null or c.incidentDate >= :fromDate)
              and (:toDate is null or c.incidentDate <= :toDate)
            order by c.createdAt desc
            """)
    List<Complaint> search(String complaintNumber, String crimeType, ComplaintStatus status, PriorityLevel priority, Long officerId, LocalDate fromDate, LocalDate toDate);
}
