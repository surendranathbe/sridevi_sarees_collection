package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.AdminProfileResponse;
import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.LoginRequest;
import com.sridevisarees.backend.dto.LoginResponse;
import com.sridevisarees.backend.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminAuthService authService;

    public AuthController(AdminAuthService authService) {
        this.authService = authService;
    }

    /**
     * Admin login endpoint: validates credentials with BCrypt, returns JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticateAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful.", response));
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
        boolean valid = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(ApiResponse.success("Token verified.", Map.of(
                "valid", valid,
                "email", valid ? authentication.getName() : ""
        )));
    }
}
