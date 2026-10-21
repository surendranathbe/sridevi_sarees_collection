package com.sridevisarees.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class SrideviBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(SrideviBackendApplication.class);

    public static void main(String[] args) {
        loadDotenvIfPresent();
        SpringApplication.run(SrideviBackendApplication.class, args);
    }

    /**
     * Natively loads .env variables into System properties if a .env file exists,
     * supporting execution from either backend/ or project root directory.
     */
    private static void loadDotenvIfPresent() {
        String[] possiblePaths = {".env", "backend/.env", "../.env"};
        for (String pathStr : possiblePaths) {
            Path p = Paths.get(pathStr);
            if (Files.isRegularFile(p)) {
                log.info("Loading environment variables from: {}", p.toAbsolutePath());
                try (BufferedReader reader = Files.newBufferedReader(p, StandardCharsets.UTF_8)) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.warn("Could not read {}: {}", pathStr, e.getMessage());
                }
            }
        }

        String uri = System.getenv("MONGODB_URI");
        if (uri == null) {
            uri = System.getProperty("MONGODB_URI");
        }

        if (uri != null && !uri.isBlank()) {
            log.info("Detected MONGODB_URI configuration for Sridevi Collections backend.");
        } else {
            log.warn("MONGODB_URI is not set. Ensure MONGODB_URI is set in .env or as an environment variable.");
        }
    }
}
