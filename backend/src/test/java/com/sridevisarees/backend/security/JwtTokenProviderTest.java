package com.sridevisarees.backend.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private static final String VALID_TEST_SECRET = "ValidSecretKeyForTestingJwtTokenProviderMustBe32BytesOrLonger!";

    @Test
    @DisplayName("Startup fails with clear error when JWT_SECRET is missing or blank")
    void testInitFailsWhenSecretMissing() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "configuredSecret", "");

        IllegalStateException ex = assertThrows(IllegalStateException.class, provider::init);
        assertTrue(ex.getMessage().contains("JWT_SECRET environment variable is missing"));
    }

    @Test
    @DisplayName("Startup fails with clear error when JWT_SECRET is shorter than 32 bytes")
    void testInitFailsWhenSecretTooShort() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "configuredSecret", "ShortSecretOnly16BytesLong");

        IllegalStateException ex = assertThrows(IllegalStateException.class, provider::init);
        assertTrue(ex.getMessage().contains("must be at least 32 bytes"));
    }

    @Test
    @DisplayName("Generates token with issuer 'sridevi-sarees' and parses claims successfully")
    void testGenerateAndValidateTokenWithIssuer() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "configuredSecret", VALID_TEST_SECRET);
        ReflectionTestUtils.setField(provider, "jwtExpirationMs", 1800000L);
        provider.init();

        String token = provider.generateToken("admin@test.com", "ROLE_ADMIN", "Test Admin");
        assertNotNull(token);
        assertTrue(provider.validateToken(token));

        Claims claims = provider.parseAndValidateClaims(token);
        assertEquals("sridevi-sarees", claims.getIssuer());
        assertEquals("admin@test.com", claims.getSubject());
        assertEquals("ROLE_ADMIN", claims.get("role", String.class));
        assertEquals("Test Admin", claims.get("name", String.class));
    }
}

