package com.sridevisarees.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "embroidery_services")
public class EmbroideryService {

    @Id
    private String id;

    @Indexed(unique = true)
    private String serviceId;

    private String designName;
    private String category;
    private Double cost;
    private String leadTime;
    private String description;
    private String imageUrl;
    private Instant createdAt;
    private Instant updatedAt;

    public EmbroideryService() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public EmbroideryService(String serviceId, String designName, String category, Double cost, String leadTime, String description, String imageUrl) {
        this();
        this.serviceId = serviceId;
        this.designName = designName;
        this.category = category;
        this.cost = cost;
        this.leadTime = leadTime;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getDesignName() {
        return designName;
    }

    public void setDesignName(String designName) {
        this.designName = designName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getLeadTime() {
        return leadTime;
    }

    public void setLeadTime(String leadTime) {
        this.leadTime = leadTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

