package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.LoginRequest;
import com.sridevisarees.backend.dto.LoginResponse;
import com.sridevisarees.backend.exception.GlobalExceptionHandler;
import com.sridevisarees.backend.exception.RateLimitExceededException;
import com.sridevisarees.backend.service.AdminAuthService;
import com.sridevisarees.backend.service.RateLimitingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class AuthControllerSecurityTest {

    private RateLimitingService rateLimiter;
    private AuthController authController;
    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        rateLimiter = new RateLimitingService();
        exceptionHandler = new GlobalExceptionHandler();

        org.springframework.security.crypto.password.PasswordEncoder passwordEncoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

        // Stubbed authService for isolated controller testing
        AdminAuthService stubAuthService = new AdminAuthService(null, passwordEncoder, null, rateLimiter) {
            @Override
            public LoginResponse authenticateAdmin(LoginRequest request) {
                if ("admin@example.com".equals(request.getEmail()) && "CorrectPass123!".equals(request.getPassword())) {
                    return new LoginResponse("test.jwt.token", "admin@example.com", "Admin", "ROLE_ADMIN", Instant.now().plusSeconds(1800));
                }
                throw new BadCredentialsException(GENERIC_LOGIN_ERROR);
            }
        };

        authController = new AuthController(stubAuthService, rateLimiter);
    }

    @Test
    @DisplayName("Returns HTTP 429 when client IP exceeds 5 login attempts within 15 minutes")
    void testLoginEnforcesRateLimit429() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("198.51.100.25");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@example.com");
        loginRequest.setPassword("WrongPassword!");

        // First 5 attempts consume the rate limiter bucket
        for (int i = 1; i <= 5; i++) {
            try {
                authController.login(loginRequest, request);
            } catch (BadCredentialsException ignored) {
                // Expected credential failures during brute force attempt
            }
        }

        // 6th attempt must throw RateLimitExceededException
        RateLimitExceededException ex = assertThrows(RateLimitExceededException.class, () ->
                authController.login(loginRequest, request));

        // When handled by GlobalExceptionHandler, it produces HTTP 429 Too Many Requests
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleRateLimitExceeded(ex);
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Too many login attempts. Please try again later.", response.getBody().getMessage());
    }

    @Test
    @DisplayName("Handles BadCredentialsException with HTTP 401 and generic message")
    void testBadCredentialsProducesGeneric401() {
        BadCredentialsException ex = new BadCredentialsException("Invalid email or password.");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBadCredentials(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid email or password.", response.getBody().getMessage());
    }
}
