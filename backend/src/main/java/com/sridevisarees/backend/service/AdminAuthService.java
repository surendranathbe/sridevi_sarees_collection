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
import java.util.Optional;

@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);
    public static final String GENERIC_LOGIN_ERROR = "Invalid email or password.";

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RateLimitingService rateLimitingService;
    private final String dummyBcryptHash;

    public AdminAuthService(AdminRepository adminRepository,
                            PasswordEncoder passwordEncoder,
                            JwtTokenProvider jwtTokenProvider,
                            RateLimitingService rateLimitingService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.rateLimitingService = rateLimitingService;
        this.dummyBcryptHash = passwordEncoder.encode("sridevi-dummy-bcrypt-hash-timing-defense");
    }

    public LoginResponse authenticateAdmin(LoginRequest request) {
        String email = (request.getEmail() != null) ? request.getEmail().trim().toLowerCase() : "";
        String rawPassword = (request.getPassword() != null) ? request.getPassword() : "";

        Optional<Admin> adminOpt = adminRepository.findByEmailIgnoreCase(email);

        // When email does not exist, run dummy BCrypt match so response time does not reveal whether the account exists
        if (adminOpt.isEmpty()) {
            passwordEncoder.matches(rawPassword, dummyBcryptHash);
            rateLimitingService.recordFailedAttempt(email);
            log.warn("Authentication failed: invalid credentials for email '{}'", email);
            throw new BadCredentialsException(GENERIC_LOGIN_ERROR);
        }

        Admin admin = adminOpt.get();

        // When account is deactivated, still evaluate password match to ensure timing consistency, then reject with generic error
        if (!admin.isActive()) {
            passwordEncoder.matches(rawPassword, admin.getPassword());
            rateLimitingService.recordFailedAttempt(email);
            log.warn("Authentication rejected: account inactive for email '{}'", email);
            throw new BadCredentialsException(GENERIC_LOGIN_ERROR);
        }

        // Verify BCrypt password
        if (!passwordEncoder.matches(rawPassword, admin.getPassword())) {
            rateLimitingService.recordFailedAttempt(email);
            log.warn("Authentication failed: invalid credentials for email '{}'", email);
            throw new BadCredentialsException(GENERIC_LOGIN_ERROR);
        }

        // Reset account failures on successful authentication
        rateLimitingService.resetAccountFailures(email);

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
