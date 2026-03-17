package com.cybercrime.repository;

import com.cybercrime.entity.CrimeCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrimeCategoryRepository extends JpaRepository<CrimeCategory, Long> {
    Optional<CrimeCategory> findByNameIgnoreCase(String name);
}
