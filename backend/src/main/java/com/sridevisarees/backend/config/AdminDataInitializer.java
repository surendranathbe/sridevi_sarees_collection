package com.sridevisarees.backend.config;

import com.sridevisarees.backend.model.Admin;
import com.sridevisarees.backend.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            // Provision requested administrator account:
            // Email / Username: Sridevisarees.com
            // Password: Sridevisarees@1644
            createOrUpdateAdmin("Sridevisarees.com", "Sridevisarees@1644", "Sridevi Administrator");

            // Also keep admin@sridevisarees.com synchronized with Sridevisarees@1644
            createOrUpdateAdmin("admin@sridevisarees.com", "Sridevisarees@1644", "Sridevi Store Administrator");
        } catch (Exception e) {
            log.error("Could not complete admin account initialization: {}", e.getMessage());
        }
    }

    private void createOrUpdateAdmin(String emailOrUsername, String rawPassword, String name) {
        String normalized = emailOrUsername.trim().toLowerCase();
        Admin admin = adminRepository.findByEmailIgnoreCase(normalized).orElse(null);

        String hashedPassword = passwordEncoder.encode(rawPassword);

        if (admin == null) {
            Admin newAdmin = new Admin(normalized, hashedPassword, name);
            newAdmin.setRole("ROLE_ADMIN");
            newAdmin.setActive(true);
            adminRepository.save(newAdmin);
            log.info("Provisioned administrator '{}' in MongoDB Atlas with BCrypt-hashed password.", emailOrUsername);
        } else {
            // Update password to ensure it matches the requested credentials
            admin.setPassword(hashedPassword);
            admin.setActive(true);
            adminRepository.save(admin);
            log.info("Updated administrator '{}' in MongoDB Atlas with new BCrypt-hashed password.", emailOrUsername);
        }
    }
}
