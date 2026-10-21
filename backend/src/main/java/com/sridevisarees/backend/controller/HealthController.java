package com.sridevisarees.backend.controller;

import com.mongodb.client.MongoClient;
import com.sridevisarees.backend.config.MongoConfig;
import com.sridevisarees.backend.model.TestConnectionDocument;
import com.sridevisarees.backend.repository.TestConnectionRepository;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final MongoConfig mongoConfig;
    private final MongoClient mongoClient;
    private final TestConnectionRepository testRepository;

    public HealthController(MongoConfig mongoConfig,
                            MongoClient mongoClient,
                            TestConnectionRepository testRepository) {
        this.mongoConfig = mongoConfig;
        this.mongoClient = mongoClient;
        this.testRepository = testRepository;
    }

    /**
     * General service health check.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Sridevi Sarees & Collections Backend API");
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("targetDatabase", MongoConfig.DATABASE_NAME);

        String uri = mongoConfig.resolveMongoUri();
        boolean hasUri = uri != null && !uri.isBlank();
        response.put("mongoUriConfigured", hasUri);

        return ResponseEntity.ok(response);
    }

    /**
     * Database health-check endpoint that executes a 'ping' command against MongoDB Atlas.
     */
    @GetMapping("/health/db")
    public ResponseEntity<Map<String, Object>> getDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("targetDatabase", MongoConfig.DATABASE_NAME);

        String uri = mongoConfig.resolveMongoUri();
        if (uri == null || uri.isBlank()) {
            response.put("status", "NOT_CONFIGURED");
            response.put("message", "MONGODB_URI environment variable is not set. Please add MONGODB_URI in backend/.env or your system environment.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        try {
            log.info("Executing database ping on '{}'...", MongoConfig.DATABASE_NAME);
            Document pingCommand = new Document("ping", 1);
            Document pingResult = mongoClient.getDatabase(MongoConfig.DATABASE_NAME).runCommand(pingCommand);

            response.put("status", "CONNECTED");
            response.put("message", "Successfully connected to MongoDB Atlas database: " + MongoConfig.DATABASE_NAME);
            response.put("pingOk", pingResult.get("ok"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Database connection check failed: {}", e.getMessage());
            response.put("status", "CONNECTION_FAILED");
            response.put("error", e.getMessage());
            response.put("hint", "Verify your MongoDB Atlas username, password, IP access list (allow 0.0.0.0/0 or your current IP), and cluster host.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    /**
     * Database write & read verification endpoint:
     * Saves a test document and immediately queries it back to verify full read/write functionality.
     */
    @PostMapping("/test/mongodb")
    public ResponseEntity<Map<String, Object>> testSaveAndRetrieve(
            @RequestBody(required = false) Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("targetDatabase", MongoConfig.DATABASE_NAME);

        String uri = mongoConfig.resolveMongoUri();
        if (uri == null || uri.isBlank()) {
            response.put("status", "NOT_CONFIGURED");
            response.put("error", "MONGODB_URI is not set. Cannot perform write/read test.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        try {
            String testMsg = (body != null && body.containsKey("message"))
                    ? body.get("message")
                    : "MongoDB Atlas connection verified successfully for Sridevi Sarees & Collections";

            // Step 1: Save document to MongoDB Atlas
            TestConnectionDocument newDoc = new TestConnectionDocument(
                    testMsg,
                    MongoConfig.DATABASE_NAME,
                    "VERIFIED"
            );
            TestConnectionDocument savedDoc = testRepository.save(newDoc);
            log.info("Saved test document with ID: {}", savedDoc.getId());

            // Step 2: Retrieve document by ID to confirm read capability
            TestConnectionDocument retrievedDoc = testRepository.findById(savedDoc.getId())
                    .orElseThrow(() -> new IllegalStateException("Test document was saved but could not be retrieved by ID"));

            response.put("status", "SUCCESS");
            response.put("operation", "SAVE_AND_RETRIEVE");
            response.put("message", "Document successfully written to and read from MongoDB Atlas collection 'connection_tests'.");
            response.put("savedDocument", retrievedDoc);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("MongoDB save/retrieve test failed: {}", e.getMessage());
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint to retrieve the latest test connection documents.
     */
    @GetMapping("/test/mongodb")
    public ResponseEntity<Map<String, Object>> getTestDocuments() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("targetDatabase", MongoConfig.DATABASE_NAME);

        String uri = mongoConfig.resolveMongoUri();
        if (uri == null || uri.isBlank()) {
            response.put("status", "NOT_CONFIGURED");
            response.put("error", "MONGODB_URI is not set.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        try {
            List<TestConnectionDocument> docs = testRepository.findTop10ByOrderByCreatedAtDesc();
            response.put("status", "SUCCESS");
            response.put("count", docs.size());
            response.put("documents", docs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
