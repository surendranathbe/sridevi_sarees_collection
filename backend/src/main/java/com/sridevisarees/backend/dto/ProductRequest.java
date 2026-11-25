package com.sridevisarees.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProductRequest {

    @Size(max = 50, message = "Product ID must not exceed 50 characters")
    @Pattern(regexp = "^$|^[a-zA-Z0-9-]+$", message = "Product ID may only contain letters, numbers, and hyphens")
    private String productId;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 150, message = "Product name must be between 2 and 150 characters")
    private String name;

    @NotBlank(message = "Saree category is required")
    @Size(min = 2, max = 80, message = "Category must be between 2 and 80 characters")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Invalid category format")
    private String category;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Primary image is required")
    @Size(max = 2000, message = "First image URL/path must not exceed 2000 characters")
    private String firstImageUrl;

    @Size(max = 2000, message = "Hover image URL/path must not exceed 2000 characters")
    private String hoverImageUrl;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost must be a positive number")
    @DecimalMax(value = "10000000.0", message = "Cost cannot exceed ₹10,000,000")
    private Double cost;

    public ProductRequest() {
    }

    public ProductRequest(String productId, String name, String description, String firstImageUrl, String hoverImageUrl, Double cost) {
        this(productId, name, "", description, firstImageUrl, hoverImageUrl, cost);
    }

    public ProductRequest(String productId, String name, String category, String description, String firstImageUrl, String hoverImageUrl, Double cost) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.description = description;
        this.firstImageUrl = firstImageUrl;
        this.hoverImageUrl = hoverImageUrl;
        this.cost = cost;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFirstImageUrl() {
        return firstImageUrl;
    }

    public void setFirstImageUrl(String firstImageUrl) {
        this.firstImageUrl = firstImageUrl;
    }

    public String getHoverImageUrl() {
        return hoverImageUrl;
    }

    public void setHoverImageUrl(String hoverImageUrl) {
        this.hoverImageUrl = hoverImageUrl;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }
}

