package com.sridevisarees.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EmbroideryServiceRequest {

    @NotBlank(message = "Service ID is required")
    @Size(min = 1, max = 50, message = "Service ID must be between 1 and 50 characters")
    private String serviceId;

    @NotBlank(message = "Design name is required")
    @Size(min = 2, max = 150, message = "Design name must be between 2 and 150 characters")
    private String designName;

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 100, message = "Category must be between 2 and 100 characters")
    private String category;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost must be a positive number")
    @DecimalMax(value = "10000000.0", message = "Cost cannot exceed ₹10,000,000")
    private Double cost;

    @Size(max = 100, message = "Lead time must not exceed 100 characters")
    private String leadTime;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 2000, message = "Image URL/path must not exceed 2000 characters")
    private String imageUrl;

    public EmbroideryServiceRequest() {
    }

    public EmbroideryServiceRequest(String serviceId, String designName, String category, Double cost, String leadTime, String description, String imageUrl) {
        this.serviceId = serviceId;
        this.designName = designName;
        this.category = category;
        this.cost = cost;
        this.leadTime = leadTime;
        this.description = description;
        this.imageUrl = imageUrl;
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
}

