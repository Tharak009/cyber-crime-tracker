package com.cybercrime.repository;

import com.cybercrime.entity.RoleName;
import com.cybercrime.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetToken(String resetToken);
    List<User> findByRoleName(RoleName roleName);
}
