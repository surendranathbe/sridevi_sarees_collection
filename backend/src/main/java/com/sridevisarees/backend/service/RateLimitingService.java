package com.sridevisarees.backend.service;

import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    public static final int MAX_ATTEMPTS_PER_IP = 5;
    public static final long WINDOW_DURATION_MS = 15 * 60 * 1000L; // 15 minutes

    private final Map<String, Deque<Long>> ipAttempts = new ConcurrentHashMap<>();
    private final Map<String, Integer> accountFailureCounts = new ConcurrentHashMap<>();
    private final Clock clock;

    public RateLimitingService() {
        this(Clock.systemUTC());
    }

    public RateLimitingService(Clock clock) {
        this.clock = clock;
    }

    /**
     * Checks rate limit for client IP: allows max 5 attempts per 15 minutes.
     *
     * @param clientIp client IP address
     * @return true if attempt is permitted, false if rate limit is exceeded
     */
    public synchronized boolean tryAcquire(String clientIp) {
        String key = (clientIp != null && !clientIp.isBlank()) ? clientIp.trim() : "UNKNOWN";
        long now = clock.millis();
        long windowStart = now - WINDOW_DURATION_MS;

        Deque<Long> attempts = ipAttempts.computeIfAbsent(key, k -> new ArrayDeque<>());

        // Evict entries outside the sliding 15-minute window
        while (!attempts.isEmpty() && attempts.peekFirst() < windowStart) {
            attempts.pollFirst();
        }

        if (attempts.size() >= MAX_ATTEMPTS_PER_IP) {
            return false;
        }

        attempts.addLast(now);
        return true;
    }

    /**
     * Records a failed attempt for the account and applies a progressive delay.
     * Never locks or deactivates the account.
     *
     * @param email account email
     * @return the delay in milliseconds applied
     */
    public long recordFailedAttempt(String email) {
        if (email == null || email.isBlank()) {
            return 0;
        }
        String normalizedEmail = email.trim().toLowerCase();
        int failures = accountFailureCounts.merge(normalizedEmail, 1, Integer::sum);
        long delayMs = getProgressiveDelayMs(failures);

        if (delayMs > 0) {
            try {
                Thread.sleep(delayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return delayMs;
    }

    /**
     * Resets failed attempt counter upon successful login.
     */
    public void resetAccountFailures(String email) {
        if (email != null) {
            accountFailureCounts.remove(email.trim().toLowerCase());
        }
    }

    public int getAccountFailures(String email) {
        if (email == null) return 0;
        return accountFailureCounts.getOrDefault(email.trim().toLowerCase(), 0);
    }

    public long getProgressiveDelayMs(int failures) {
        if (failures <= 1) return 0;
        if (failures == 2) return 200;
        if (failures == 3) return 500;
        if (failures == 4) return 1000;
        return 2000; // max 2.0s delay
    }

    public void resetAll() {
        ipAttempts.clear();
        accountFailureCounts.clear();
    }
}

