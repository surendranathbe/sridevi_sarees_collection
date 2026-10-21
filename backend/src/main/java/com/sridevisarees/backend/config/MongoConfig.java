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

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);
    public static final String DATABASE_NAME = "sridevi_collections_db";

    @Value("${spring.data.mongodb.uri:}")
    private String configuredUri;

    @Bean
    @Primary
    public MongoClient mongoClient() {
        String uri = resolveMongoUri();
        if (uri == null || uri.isBlank()) {
            log.warn("MONGODB_URI is not set. A placeholder client is initialized; database calls will fail until MONGODB_URI is configured.");
            return MongoClients.create("mongodb://localhost:27017");
        }

        try {
            ConnectionString connectionString = new ConnectionString(uri);
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .applyToSocketSettings(builder -> builder
                            .connectTimeout(5000, TimeUnit.MILLISECONDS)
                            .readTimeout(5000, TimeUnit.MILLISECONDS))
                    .applyToClusterSettings(builder -> builder
                            .serverSelectionTimeout(5000, TimeUnit.MILLISECONDS))
                    .build();

            log.info("Initialized MongoDB client targeting database: '{}'", DATABASE_NAME);
            return MongoClients.create(settings);
        } catch (Exception e) {
            log.error("Failed to parse MONGODB_URI: {}", e.getMessage());
            return MongoClients.create("mongodb://localhost:27017");
        }
    }

    @Bean
    @Primary
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(mongoClient, DATABASE_NAME);
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTemplate(mongoDatabaseFactory);
    }

    public String resolveMongoUri() {
        String envUri = System.getenv("MONGODB_URI");
        if (envUri != null && !envUri.isBlank()) {
            return envUri.trim();
        }
        String sysProp = System.getProperty("MONGODB_URI");
        if (sysProp != null && !sysProp.isBlank()) {
            return sysProp.trim();
        }
        if (configuredUri != null && !configuredUri.isBlank()) {
            return configuredUri.trim();
        }
        return null;
    }
}
