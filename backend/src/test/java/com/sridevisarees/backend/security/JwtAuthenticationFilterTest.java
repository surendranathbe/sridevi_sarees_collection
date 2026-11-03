package com.sridevisarees.backend.security;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;

class JwtAuthenticationFilterTest {

    private JwtTokenProvider tokenProvider;
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "configuredSecret", "SecretKeyForTestingJwtAuthenticationFilter32BytesLong!");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 1800000L);
        tokenProvider.init();

        filter = new JwtAuthenticationFilter(tokenProvider);
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Rejects token with blank or missing role and does not authenticate")
    void testRejectsTokenWithMissingRole() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String token = tokenProvider.generateToken("user@test.com", "", "User");
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();

        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (req, res) -> chainCalled.set(true);

        filter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertTrue(chainCalled.get());
    }

    @Test
    @DisplayName("Rejects token with role other than ROLE_ADMIN")
    void testRejectsTokenWithNonAdminRole() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String token = tokenProvider.generateToken("customer@test.com", "ROLE_USER", "Customer");
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();

        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (req, res) -> chainCalled.set(true);

        filter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertTrue(chainCalled.get());
    }

    @Test
    @DisplayName("Accepts token with ROLE_ADMIN and sets SecurityContext authentication")
    void testAcceptsTokenWithRoleAdmin() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String token = tokenProvider.generateToken("admin@test.com", "ROLE_ADMIN", "Admin User");
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();

        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain filterChain = (req, res) -> chainCalled.set(true);

        filter.doFilter(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("admin@test.com", SecurityContextHolder.getContext().getAuthentication().getName());
        assertTrue(SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(chainCalled.get());
    }
}
