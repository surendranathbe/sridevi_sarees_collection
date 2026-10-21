package com.sridevisarees.backend.dto;

import java.time.Instant;

public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String email;
    private String name;
    private String role;
    private Instant expiresAt;

    public LoginResponse() {
    }

    public LoginResponse(String token, String email, String name, String role, Instant expiresAt) {
        this.token = token;
        this.type = "Bearer";
        this.email = email;
        this.name = name;
        this.role = role;
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
