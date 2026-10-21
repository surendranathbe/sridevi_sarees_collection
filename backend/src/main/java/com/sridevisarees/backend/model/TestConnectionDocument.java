package com.sridevisarees.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "connection_tests")
public class TestConnectionDocument {

    @Id
    private String id;

    private String message;
    private String database;
    private String status;
    private Instant createdAt;

    public TestConnectionDocument() {
        this.createdAt = Instant.now();
    }

    public TestConnectionDocument(String message, String database, String status) {
        this.message = message;
        this.database = database;
        this.status = status;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
