package com.cybercrime.repository;

import com.cybercrime.entity.Announcement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByPublishedTrueOrderByCreatedAtDesc();
}
