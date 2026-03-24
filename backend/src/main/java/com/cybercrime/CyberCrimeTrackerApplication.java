package com.cybercrime;

import com.cybercrime.entity.AccountStatus;
import com.cybercrime.entity.CrimeCategory;
import com.cybercrime.entity.Role;
import com.cybercrime.entity.RoleName;
import com.cybercrime.entity.User;
import com.cybercrime.repository.CrimeCategoryRepository;
import com.cybercrime.repository.RoleRepository;
import com.cybercrime.repository.UserRepository;
import java.sql.Connection;
import java.util.List;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class CyberCrimeTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CyberCrimeTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDefaults(RoleRepository roleRepository,
                                   UserRepository userRepository,
                                   CrimeCategoryRepository crimeCategoryRepository,
                                   PasswordEncoder passwordEncoder,
                                   JdbcTemplate jdbcTemplate,
                                   DataSource dataSource) {
        return args -> {
            applyTextColumnMigrations(jdbcTemplate, dataSource);

            for (RoleName roleName : RoleName.values()) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            }

            if (userRepository.findByEmail("admin@cybercrime.local").isEmpty()) {
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();
                userRepository.save(User.builder()
                        .fullName("System Administrator")
                        .email("admin@cybercrime.local")
                        .password(passwordEncoder.encode("Admin@123"))
                        .phone("9999999999")
                        .status(AccountStatus.ACTIVE)
                        .emailVerified(true)
                        .role(adminRole)
                        .build());
            }

            Role officerRole = roleRepository.findByName(RoleName.ROLE_OFFICER).orElseThrow();
            Role citizenRole = roleRepository.findByName(RoleName.ROLE_CITIZEN).orElseThrow();

            seedUser(userRepository, passwordEncoder, officerRole,
                    "Ajay Krishna", "officer1@cybercrime.local", "9000000001");
            seedUser(userRepository, passwordEncoder, officerRole,
                    "Krishna Manohar", "officer2@cybercrime.local", "9000000002");
            seedUser(userRepository, passwordEncoder, officerRole,
                    "Seetharama Raju", "officer3@cybercrime.local", "9000000003");
            seedUser(userRepository, passwordEncoder, officerRole,
                    "Surya Bhai", "officer4@cybercrime.local", "9000000004");
            seedUser(userRepository, passwordEncoder, officerRole,
                    "Gautham", "officer5@cybercrime.local", "9000000005");
            seedUser(userRepository, passwordEncoder, officerRole,
                    "Bharat Ram", "officer6@cybercrime.local", "9000000006");

            seedUser(userRepository, passwordEncoder, citizenRole,
                    "Rahul Kumar", "citizen1@cybercrime.local", "9111111111");
            seedUser(userRepository, passwordEncoder, citizenRole,
                    "Ananya Singh", "citizen2@cybercrime.local", "9222222222");

            List<String> defaults = List.of(
                    "Online Fraud", "Phishing", "Identity Theft", "Social Media Hacking",
                    "Cyber Stalking", "Fake Websites", "Online Harassment", "Credit Card Fraud",
                    "OTP Scam", "Malware Attack", "Online Shopping Fraud"
            );

            defaults.forEach(name -> crimeCategoryRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> crimeCategoryRepository.save(CrimeCategory.builder()
                            .name(name)
                            .description(name + " related incidents")
                            .build())));
        };
    }

    private void applyTextColumnMigrations(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        String databaseProductName = resolveDatabaseProductName(dataSource);
        log.info("Applying startup schema adjustments for database: {}", databaseProductName);

        if (databaseProductName.contains("postgresql")) {
            runMigration(jdbcTemplate, "ALTER TABLE complaints ALTER COLUMN description TYPE TEXT");
            runMigration(jdbcTemplate, "ALTER TABLE complaints ALTER COLUMN resolution_summary TYPE TEXT");
            runMigration(jdbcTemplate, "ALTER TABLE case_notes ALTER COLUMN note TYPE TEXT");
            runMigration(jdbcTemplate, "ALTER TABLE announcements ALTER COLUMN content TYPE TEXT");
            return;
        }

        if (databaseProductName.contains("mysql")) {
            runMigration(jdbcTemplate, "ALTER TABLE complaints MODIFY COLUMN description LONGTEXT NOT NULL");
            runMigration(jdbcTemplate, "ALTER TABLE complaints MODIFY COLUMN resolution_summary LONGTEXT NULL");
            runMigration(jdbcTemplate, "ALTER TABLE case_notes MODIFY COLUMN note LONGTEXT NOT NULL");
            runMigration(jdbcTemplate, "ALTER TABLE announcements MODIFY COLUMN content LONGTEXT NOT NULL");
            return;
        }

        log.info("No vendor-specific text column migration configured for database: {}", databaseProductName);
    }

    private String resolveDatabaseProductName(DataSource dataSource) {
        try (Connection connection = dataSource.getConnection()) {
            return connection.getMetaData().getDatabaseProductName().toLowerCase();
        } catch (Exception ex) {
            log.warn("Could not determine database product name: {}", ex.getMessage());
            return "unknown";
        }
    }

    private void runMigration(JdbcTemplate jdbcTemplate, String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception ex) {
            log.warn("Schema adjustment failed for SQL [{}]: {}", sql, ex.getMessage());
        }
    }

    private void seedUser(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          Role role,
                          String fullName,
                          String email,
                          String phone) {
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            existingUser.setFullName(fullName);
            existingUser.setPhone(phone);
            existingUser.setStatus(AccountStatus.ACTIVE);
            existingUser.setEmailVerified(true);
            existingUser.setRole(role);
            userRepository.save(existingUser);
            return;
        }
        userRepository.save(User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode("Officer@123"))
                .phone(phone)
                .status(AccountStatus.ACTIVE)
                .emailVerified(true)
                .role(role)
                .build());
    }
}
