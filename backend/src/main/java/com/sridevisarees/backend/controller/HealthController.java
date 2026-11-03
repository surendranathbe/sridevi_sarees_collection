package com.sridevisarees.backend.controller;

import com.mongodb.client.MongoClient;
import com.sridevisarees.backend.config.MongoConfig;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final MongoConfig mongoConfig;
    private final MongoClient mongoClient;

    public HealthController(MongoConfig mongoConfig, MongoClient mongoClient) {
        this.mongoConfig = mongoConfig;
        this.mongoClient = mongoClient;
    }

    /**
     * Public lightweight service health check.
     * Returns strictly {"status": "UP"}.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> getSystemHealth() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    /**
     * Database health check endpoint: requires ROLE_ADMIN.
     * Never exposes stack traces, exception messages, connection strings, or network topology hints.
     */
    @GetMapping("/health/db")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getDatabaseHealth() {
        String uri = mongoConfig.resolveMongoUri();
        if (uri == null || uri.isBlank()) {
            log.warn("Database health check failed: MONGODB_URI is not configured.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "DOWN", "error", "Database connection unavailable."));
        }

        try {
            log.info("Admin database ping requested for '{}'...", MongoConfig.DATABASE_NAME);
            Document pingCommand = new Document("ping", 1);
            mongoClient.getDatabase(MongoConfig.DATABASE_NAME).runCommand(pingCommand);

            return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "database", MongoConfig.DATABASE_NAME
            ));
        } catch (Exception e) {
            log.error("Database connection ping check failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "DOWN", "error", "Database connection unavailable."));
        }
    }
}
