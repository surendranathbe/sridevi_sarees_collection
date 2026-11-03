package com.sridevisarees.backend.controller;

import com.mongodb.client.MongoClient;
import com.sridevisarees.backend.config.MongoConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Proxy;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    @Test
    @DisplayName("GET /api/health returns only {'status': 'UP'}")
    void testSystemHealthReturnsOnlyStatusUp() {
        MongoConfig mongoConfig = new MongoConfig();
        HealthController controller = new HealthController(mongoConfig, null);

        ResponseEntity<Map<String, String>> response = controller.getSystemHealth();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size(), "Response body should contain ONLY status key");
        assertEquals("UP", response.getBody().get("status"));
        assertNull(response.getBody().get("javaVersion"));
        assertNull(response.getBody().get("mongoUriConfigured"));
        assertNull(response.getBody().get("service"));
    }

    @Test
    @DisplayName("GET /api/health/db returns generic error when MongoDB throws exception")
    void testDatabaseHealthGenericErrorOnFailure() {
        MongoConfig mongoConfig = new MongoConfig() {
            @Override
            public String resolveMongoUri() {
                return "mongodb://dummy-configured-host:27017";
            }
        };

        MongoClient failingMongoClient = (MongoClient) Proxy.newProxyInstance(
                MongoClient.class.getClassLoader(),
                new Class<?>[]{MongoClient.class},
                (proxy, method, args) -> {
                    throw new RuntimeException("Sensitive database host timeout connection error cluster0.internal.mongodb.net");
                }
        );

        HealthController controller = new HealthController(mongoConfig, failingMongoClient);
        ResponseEntity<Map<String, String>> response = controller.getDatabaseHealth();

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("DOWN", response.getBody().get("status"));
        assertEquals("Database connection unavailable.", response.getBody().get("error"));
        // Confirm no internal host string or raw exception message is exposed
        assertFalse(response.getBody().toString().contains("cluster0.internal.mongodb.net"));
        assertFalse(response.getBody().toString().contains("0.0.0.0/0"));
    }
}

