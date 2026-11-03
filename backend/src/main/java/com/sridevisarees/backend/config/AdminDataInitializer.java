package com.sridevisarees.backend.config;

import com.sridevisarees.backend.model.Admin;
import com.sridevisarees.backend.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:${admin.email:}}")
    private String adminEmailProperty;

    @Value("${ADMIN_INITIAL_PASSWORD:${admin.initial-password:}}")
    private String adminInitialPasswordProperty;

    public AdminDataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            // Check if any admin account already exists
            long existingAdminCount = adminRepository.count();
            if (existingAdminCount > 0) {
                log.info("Administrator account already exists (count: {}). Skipping initial provisioning.", existingAdminCount);
                return;
            }

            // Read ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD from environment or property
            String envEmail = System.getenv("ADMIN_EMAIL");
            String email = (envEmail != null && !envEmail.isBlank()) ? envEmail : adminEmailProperty;

            String envPassword = System.getenv("ADMIN_INITIAL_PASSWORD");
            String initialPassword = (envPassword != null && !envPassword.isBlank()) ? envPassword : adminInitialPasswordProperty;

            if (email == null || email.isBlank() || initialPassword == null || initialPassword.isBlank()) {
                log.warn("ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD environment variable is not configured. Admin provisioning skipped.");
                return;
            }

            String trimmedEmail = email.trim().toLowerCase();
            String trimmedPassword = initialPassword.trim();

            // Enforce minimum password length of 12 characters
            if (trimmedPassword.length() < 12) {
                log.error("Initial admin password is too short (length: {}). Password must be at least 12 characters. Account creation rejected.",
                        trimmedPassword.length());
                return;
            }

            // Provision exactly one administrator
            String hashedPassword = passwordEncoder.encode(trimmedPassword);
            Admin newAdmin = new Admin(trimmedEmail, hashedPassword, "Store Administrator");
            newAdmin.setRole("ROLE_ADMIN");
            newAdmin.setActive(true);
            adminRepository.save(newAdmin);

            log.info("Initial administrator account successfully provisioned for '{}'.", trimmedEmail);
        } catch (Throwable t) {
            log.warn("Admin account auto-provisioning deferred: Database is currently unreachable ({}).", t.getMessage());
        }
    }
}
