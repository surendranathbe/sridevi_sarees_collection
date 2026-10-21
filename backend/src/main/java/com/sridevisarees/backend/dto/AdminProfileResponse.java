package com.sridevisarees.backend.dto;

import java.time.Instant;

public class AdminProfileResponse {

    private String id;
    private String email;
    private String name;
    private String role;
    private Instant lastLoginAt;

    public AdminProfileResponse() {
    }

    public AdminProfileResponse(String id, String email, String name, String role, Instant lastLoginAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.lastLoginAt = lastLoginAt;
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

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(Instant lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
