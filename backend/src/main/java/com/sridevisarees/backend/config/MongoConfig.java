package com.sridevisarees.backend.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);
    public static final String DATABASE_NAME = "sridevi_collections_db";
    public static final String LOCAL_FALLBACK_URI = "mongodb://localhost:27017/sridevi_collections_db";

    private static final int CONNECT_TIMEOUT_MS = 15000;
    private static final int READ_TIMEOUT_MS = 15000;
    private static final int SERVER_SELECTION_TIMEOUT_MS = 15000;
    private static final int MAX_CONNECTION_IDLE_MS = 60000;

    @Value("${spring.data.mongodb.uri:}")
    private String configuredUri;

    @Bean
    @Primary
    public MongoClient mongoClient() {
        String uri = resolveMongoUri();
        boolean isCloudEnv = System.getenv("RENDER") != null;
        boolean isRemoteUri = uri != null && !uri.contains("localhost") && !uri.contains("127.0.0.1");

        if (isCloudEnv && !isRemoteUri) {
            log.error("MONGODB_URI is not configured for cloud deployment! Current target [{}] will fail on Render. " +
                    "Set the MONGODB_URI environment variable in Render Dashboard to your MongoDB Atlas SRV connection string.",
                    sanitizeUri(uri));
        }

        MongoClient client = buildClient(uri);

        // Verify that the connection and credentials work
        try {
            client.getDatabase(DATABASE_NAME).runCommand(new org.bson.Document("ping", 1));
            log.info("Initialized MongoDB client targeting database: '{}' ({})", DATABASE_NAME, sanitizeUri(uri));
            return client;
        } catch (Exception e) {
            log.warn("Failed to connect or authenticate with configured MongoDB URI [{}]: {}.",
                    sanitizeUri(uri), e.getMessage());

            // Only attempt localhost fallback in local development when a remote URI wasn't explicitly set
            if (!isCloudEnv && !isRemoteUri && !LOCAL_FALLBACK_URI.equals(uri)) {
                try {
                    client.close();
                } catch (Exception ignored) {}

                try {
                    MongoClient localClient = buildClient(LOCAL_FALLBACK_URI);
                    localClient.getDatabase(DATABASE_NAME).runCommand(new org.bson.Document("ping", 1));
                    log.info("Successfully connected to local MongoDB at localhost:27017/{}", DATABASE_NAME);
                    return localClient;
                } catch (Exception localEx) {
                    log.warn("Local MongoDB fallback also failed: {}. Continuing with configured client.", localEx.getMessage());
                    return buildClient(uri);
                }
            }

            // Return the configured client so the driver can retry/recover once Atlas is reachable
            return client;
        }
    }

    private MongoClient buildClient(String connectionUri) {
        try {
            ConnectionString connectionString = new ConnectionString(connectionUri);
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .applyToSocketSettings(builder -> builder
                            .connectTimeout(CONNECT_TIMEOUT_MS, TimeUnit.MILLISECONDS)
                            .readTimeout(READ_TIMEOUT_MS, TimeUnit.MILLISECONDS))
                    .applyToClusterSettings(builder -> builder
                            .serverSelectionTimeout(SERVER_SELECTION_TIMEOUT_MS, TimeUnit.MILLISECONDS))
                    .applyToConnectionPoolSettings(builder -> builder
                            .maxConnectionIdleTime(MAX_CONNECTION_IDLE_MS, TimeUnit.MILLISECONDS))
                    .build();
            return MongoClients.create(settings);
        } catch (Exception ex) {
            log.error("Failed to build MongoClient for URI [{}]: {}", sanitizeUri(connectionUri), ex.getMessage());
            return MongoClients.create(LOCAL_FALLBACK_URI);
        }
    }

    @Bean
    @Primary
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(Objects.requireNonNull(mongoClient), DATABASE_NAME);
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTemplate(Objects.requireNonNull(mongoDatabaseFactory));
    }

    public String resolveMongoUri() {
        String envUri = System.getenv("MONGODB_URI");
        if (envUri != null && !envUri.isBlank()) {
            return validateOrFallback(envUri.trim());
        }
        String sysProp = System.getProperty("MONGODB_URI");
        if (sysProp != null && !sysProp.isBlank()) {
            return validateOrFallback(sysProp.trim());
        }
        if (configuredUri != null && !configuredUri.isBlank()) {
            return validateOrFallback(configuredUri.trim());
        }
        return LOCAL_FALLBACK_URI;
    }

    private String validateOrFallback(String uri) {
        if (uri.contains("<") || uri.contains(">") || uri.contains("YOUR_NEW_URL_ENCODED_PASSWORD") || uri.contains("<db_password>")) {
            log.warn("Detected unpopulated placeholder in MONGODB_URI: '{}'. Falling back to local MongoDB ({}).",
                    sanitizeUri(uri), LOCAL_FALLBACK_URI);
            return LOCAL_FALLBACK_URI;
        }
        return uri;
    }

    private String sanitizeUri(String uri) {
        if (uri == null) return "null";
        return uri.replaceAll(":[^@/]+@", ":****@");
    }
}
