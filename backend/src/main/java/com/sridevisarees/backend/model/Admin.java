package com.sridevisarees.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "admins")
public class Admin {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password; // Stored as BCrypt hash, never plain text

    private String name;

    private String role; // e.g. "ROLE_ADMIN"

    private boolean active;

    private Instant createdAt;

    private Instant lastLoginAt;

    public Admin() {
        this.active = true;
        this.role = "ROLE_ADMIN";
        this.createdAt = Instant.now();
    }

    public Admin(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = "ROLE_ADMIN";
        this.active = true;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(Instant lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
