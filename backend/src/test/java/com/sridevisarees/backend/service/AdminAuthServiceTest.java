package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.LoginRequest;
import com.sridevisarees.backend.dto.LoginResponse;
import com.sridevisarees.backend.model.Admin;
import com.sridevisarees.backend.repository.AdminRepository;
import com.sridevisarees.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AdminAuthServiceTest {

    private final Map<String, Admin> database = new HashMap<>();
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private RateLimitingService rateLimitingService;
    private AdminAuthService authService;

    @BeforeEach
    void setUp() {
        database.clear();
        passwordEncoder = new BCryptPasswordEncoder();

        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "configuredSecret", "ValidTestJwtSecretKeyForTestingAdminAuthService32BytesLong!");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 1800000L);
        jwtTokenProvider.init();

        rateLimitingService = new RateLimitingService();

        AdminRepository adminRepository = (AdminRepository) Proxy.newProxyInstance(
                AdminRepository.class.getClassLoader(),
                new Class<?>[]{AdminRepository.class},
                (proxy, method, args) -> {
                    if ("findByEmailIgnoreCase".equals(method.getName())) {
                        String email = ((String) args[0]).trim().toLowerCase();
                        return Optional.ofNullable(database.get(email));
                    }
                    if ("save".equals(method.getName())) {
                        Admin a = (Admin) args[0];
                        database.put(a.getEmail().toLowerCase(), a);
                        return a;
                    }
                    return null;
                }
        );

        authService = new AdminAuthService(adminRepository, passwordEncoder, jwtTokenProvider, rateLimitingService);

        // Seed an active admin
        Admin activeAdmin = new Admin("store.admin@example.com", passwordEncoder.encode("SecureP@ssw0rd123"), "Store Admin");
        activeAdmin.setRole("ROLE_ADMIN");
        activeAdmin.setActive(true);
        database.put(activeAdmin.getEmail().toLowerCase(), activeAdmin);

        // Seed a deactivated admin
        Admin inactiveAdmin = new Admin("inactive.admin@example.com", passwordEncoder.encode("SecureP@ssw0rd123"), "Inactive Admin");
        inactiveAdmin.setRole("ROLE_ADMIN");
        inactiveAdmin.setActive(false);
        database.put(inactiveAdmin.getEmail().toLowerCase(), inactiveAdmin);
    }

    @Test
    @DisplayName("Returns identical generic error 'Invalid email or password.' when email does not exist")
    void testUnknownEmailReturnsGenericError() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("AnyPassword123!");

        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
                () -> authService.authenticateAdmin(request));

        assertEquals("Invalid email or password.", ex.getMessage());
    }

    @Test
    @DisplayName("Returns identical generic error 'Invalid email or password.' when password is incorrect")
    void testWrongPasswordReturnsGenericError() {
        LoginRequest request = new LoginRequest();
        request.setEmail("store.admin@example.com");
        request.setPassword("WrongPassword999!");

        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
                () -> authService.authenticateAdmin(request));

        assertEquals("Invalid email or password.", ex.getMessage());
    }

    @Test
    @DisplayName("Returns identical generic error 'Invalid email or password.' when account is deactivated")
    void testDeactivatedAccountReturnsGenericError() {
        LoginRequest request = new LoginRequest();
        request.setEmail("inactive.admin@example.com");
        request.setPassword("SecureP@ssw0rd123");

        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
                () -> authService.authenticateAdmin(request));

        assertEquals("Invalid email or password.", ex.getMessage());
    }

    @Test
    @DisplayName("Successfully authenticates valid active admin and resets failure counters")
    void testSuccessfulAuthentication() {
        LoginRequest request = new LoginRequest();
        request.setEmail("store.admin@example.com");
        request.setPassword("SecureP@ssw0rd123");

        LoginResponse response = authService.authenticateAdmin(request);

        assertNotNull(response);
        assertEquals("store.admin@example.com", response.getEmail());
        assertEquals("ROLE_ADMIN", response.getRole());
        assertNotNull(response.getToken());
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        assertEquals(0, rateLimitingService.getAccountFailures("store.admin@example.com"));
    }
}

