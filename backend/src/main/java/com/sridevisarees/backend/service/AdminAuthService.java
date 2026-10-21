package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.AdminProfileResponse;
import com.sridevisarees.backend.dto.LoginRequest;
import com.sridevisarees.backend.dto.LoginResponse;
import com.sridevisarees.backend.model.Admin;
import com.sridevisarees.backend.repository.AdminRepository;
import com.sridevisarees.backend.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AdminAuthService(AdminRepository adminRepository,
                            PasswordEncoder passwordEncoder,
                            JwtTokenProvider jwtTokenProvider) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponse authenticateAdmin(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        Admin admin = adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    log.warn("Authentication failed: No admin found with email '{}'", email);
                    return new BadCredentialsException("Invalid administrator email or password.");
                });

        if (!admin.isActive()) {
            log.warn("Authentication rejected: Admin account '{}' is currently deactivated.", email);
            throw new BadCredentialsException("This administrator account has been deactivated. Please contact support.");
        }

        // Verify BCrypt password
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            log.warn("Authentication failed: Incorrect password for admin '{}'", email);
            throw new BadCredentialsException("Invalid administrator email or password.");
        }

        // Record successful login timestamp
        admin.setLastLoginAt(Instant.now());
        adminRepository.save(admin);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(admin.getEmail(), admin.getRole(), admin.getName());
        Instant expiresAt = jwtTokenProvider.getExpirationFromToken(token);

        log.info("Administrator '{}' authenticated successfully. JWT token issued.", email);

        return new LoginResponse(token, admin.getEmail(), admin.getName(), admin.getRole(), expiresAt);
    }

    public AdminProfileResponse getAdminProfile(String email) {
        Admin admin = adminRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Admin profile not found."));

        return new AdminProfileResponse(
                admin.getId(),
                admin.getEmail(),
                admin.getName(),
                admin.getRole(),
                admin.getLastLoginAt()
        );
    }

    public boolean isTokenValid(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}
