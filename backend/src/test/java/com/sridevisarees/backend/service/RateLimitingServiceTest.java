package com.sridevisarees.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitingServiceTest {

    private AtomicLong simulatedMillis;
    private RateLimitingService rateLimiter;

    @BeforeEach
    void setUp() {
        simulatedMillis = new AtomicLong(1_000_000L);
        Clock mutableClock = new Clock() {
            @Override
            public ZoneOffset getZone() {
                return ZoneOffset.UTC;
            }

            @Override
            public Clock withZone(java.time.ZoneId zone) {
                return this;
            }

            @Override
            public Instant instant() {
                return Instant.ofEpochMilli(simulatedMillis.get());
            }

            @Override
            public long millis() {
                return simulatedMillis.get();
            }
        };
        rateLimiter = new RateLimitingService(mutableClock);
    }

    @Test
    @DisplayName("Allows up to 5 attempts per IP in a 15-minute window and rejects the 6th")
    void testRateLimiterPerIpLimit() {
        String clientIp = "192.168.1.50";

        for (int i = 1; i <= 5; i++) {
            assertTrue(rateLimiter.tryAcquire(clientIp), "Attempt " + i + " should be allowed");
        }

        // 6th attempt within 15 minutes must be blocked
        assertFalse(rateLimiter.tryAcquire(clientIp), "6th attempt from the same IP must be rejected");

        // A different IP should still be allowed
        assertTrue(rateLimiter.tryAcquire("10.0.0.1"), "Different IP should not be affected by first IP limit");
    }

    @Test
    @DisplayName("Allows new attempts after the 15-minute sliding window has passed")
    void testRateLimiterSlidingWindowExpiry() {
        String clientIp = "203.0.113.10";

        for (int i = 1; i <= 5; i++) {
            assertTrue(rateLimiter.tryAcquire(clientIp));
        }
        assertFalse(rateLimiter.tryAcquire(clientIp));

        // Advance simulated time by 15 minutes + 1 second (900_001 ms)
        simulatedMillis.addAndGet(15 * 60 * 1000L + 1000L);

        // After window expiration, new attempts should be permitted
        assertTrue(rateLimiter.tryAcquire(clientIp), "Attempt after 15 minutes should be permitted");
    }

    @Test
    @DisplayName("Calculates progressive delay correctly without hard locking accounts")
    void testProgressiveDelayCalculation() {
        assertEquals(0, rateLimiter.getProgressiveDelayMs(0));
        assertEquals(0, rateLimiter.getProgressiveDelayMs(1));
        assertEquals(200, rateLimiter.getProgressiveDelayMs(2));
        assertEquals(500, rateLimiter.getProgressiveDelayMs(3));
        assertEquals(1000, rateLimiter.getProgressiveDelayMs(4));
        assertEquals(2000, rateLimiter.getProgressiveDelayMs(5));
        assertEquals(2000, rateLimiter.getProgressiveDelayMs(10));
    }

    @Test
    @DisplayName("Resets account failures upon successful login")
    void testResetAccountFailures() {
        String email = "admin@sridevisarees.com";
        rateLimiter.recordFailedAttempt(email);
        rateLimiter.recordFailedAttempt(email);
        assertEquals(2, rateLimiter.getAccountFailures(email));

        rateLimiter.resetAccountFailures(email);
        assertEquals(0, rateLimiter.getAccountFailures(email));
    }
}

