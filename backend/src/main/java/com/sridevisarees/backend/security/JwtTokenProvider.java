package com.sridevisarees.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    public static final String ISSUER = "sridevi-sarees";

    @Value("${app.jwt.secret:${JWT_SECRET:}}")
    private String configuredSecret;

    @Value("${app.jwt.expiration-ms:1800000}") // 30 minutes default (1800000 ms)
    private long jwtExpirationMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        String envSecret = System.getenv("JWT_SECRET");
        String secret = (envSecret != null && !envSecret.isBlank())
                ? envSecret.trim()
                : ((configuredSecret != null && !configuredSecret.isBlank()) ? configuredSecret.trim() : null);

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing. Application cannot start.");
        }

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("CRITICAL CONFIGURATION ERROR: JWT_SECRET must be at least 32 bytes (256 bits) long. Provided length: " + keyBytes.length + " bytes.");
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        log.info("JwtTokenProvider initialized with validated 256-bit signing key and issuer '{}'.", ISSUER);
    }

    public SecretKey getSigningKey() {
        return this.signingKey;
    }

    public String generateToken(String email, String role, String name) {
        Instant now = Instant.now();
        Instant expiry = now.plus(jwtExpirationMs, ChronoUnit.MILLIS);

        return Jwts.builder()
                .issuer(ISSUER)
                .subject(email)
                .claim("role", role)
                .claim("name", name)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(this.signingKey, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Parses and validates the token once against the signing key and required issuer.
     * @param token JWT string
     * @return Claims payload
     */
    public Claims parseAndValidateClaims(String token) {
        return Jwts.parser()
                .verifyWith(this.signingKey)
                .requireIssuer(ISSUER)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseAndValidateClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return parseAndValidateClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        return parseAndValidateClaims(token).get("role", String.class);
    }

    public Instant getExpirationFromToken(String token) {
        return parseAndValidateClaims(token).getExpiration().toInstant();
    }
}
