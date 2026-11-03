package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.AdminProfileResponse;
import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.LoginRequest;
import com.sridevisarees.backend.dto.LoginResponse;
import com.sridevisarees.backend.exception.RateLimitExceededException;
import com.sridevisarees.backend.service.AdminAuthService;
import com.sridevisarees.backend.service.RateLimitingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AdminAuthService authService;
    private final RateLimitingService rateLimitingService;

    public AuthController(AdminAuthService authService, RateLimitingService rateLimitingService) {
        this.authService = authService;
        this.rateLimitingService = rateLimitingService;
    }

    /**
     * Admin login endpoint: validates credentials with BCrypt, returns JWT token.
     * Enforces rate limiting: 5 attempts per client IP per 15 minutes.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,
                                                            HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        if (!rateLimitingService.tryAcquire(clientIp)) {
            log.warn("Login rejected: Rate limit exceeded for client IP '{}'", clientIp);
            throw new RateLimitExceededException("Too many login attempts. Please try again later.");
        }

        LoginResponse response = authService.authenticateAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful.", response));
    }

    private String extractClientIp(HttpServletRequest request) {
        if (request == null) return "UNKNOWN";
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String remoteAddr = request.getRemoteAddr();
        return (remoteAddr != null && !remoteAddr.isBlank()) ? remoteAddr.trim() : "UNKNOWN";
    }

    /**
     * Protected endpoint: returns profile of authenticated administrator.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminProfileResponse>> getCurrentAdmin(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized: No active admin session"));
        }
        AdminProfileResponse profile = authService.getAdminProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Admin profile loaded.", profile));
    }

    /**
     * Token verification endpoint: confirms current JWT is valid and not expired.
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName() != null ? authentication.getName() : "";
            return ResponseEntity.ok(ApiResponse.success("Token verified.", Map.of(
                    "valid", true,
                    "email", email
            )));
        }
        return ResponseEntity.ok(ApiResponse.success("Token verified.", Map.of(
                "valid", false,
                "email", ""
        )));
    }
}
