package com.sridevisarees.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BannerRequest {

    @NotBlank(message = "Banner title is required")
    @Size(min = 1, max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Size(max = 200, message = "Subtitle must not exceed 200 characters")
    private String subtitle;

    @NotBlank(message = "Subheadline is required")
    @Size(min = 1, max = 250, message = "Subheadline must not exceed 250 characters")
    private String subheadline;

    @NotBlank(message = "Description is required")
    @Size(min = 1, max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 100, message = "Tag must not exceed 100 characters")
    private String tag;

    @NotBlank(message = "Primary button text is required")
    @Size(min = 1, max = 60, message = "Primary button text must not exceed 60 characters")
    private String primaryButtonText;

    @NotBlank(message = "Primary button URL is required")
    @Size(min = 1, max = 500, message = "Primary button URL must not exceed 500 characters")
    private String primaryButtonUrl;

    @Size(max = 60, message = "Secondary button text must not exceed 60 characters")
    private String secondaryButtonText;

    @Size(max = 500, message = "Secondary button URL must not exceed 500 characters")
    private String secondaryButtonUrl;

    @NotBlank(message = "Desktop image is required")
    @Size(min = 1, max = 2000, message = "Desktop image path must not exceed 2000 characters")
    private String desktopImage;

    @Size(max = 2000, message = "Mobile image path must not exceed 2000 characters")
    private String mobileImage;

    @Size(max = 255, message = "Image alt text must not exceed 255 characters")
    private String imageAlt;

    @Size(max = 20, message = "Text align must not exceed 20 characters")
    private String textAlign;

    @Size(max = 50, message = "Text color theme must not exceed 50 characters")
    private String textColorTheme;

    @Size(max = 30, message = "Overlay color must not exceed 30 characters")
    private String overlayColor;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "1.0", inclusive = true)
    private Double overlayOpacity;

    private Boolean isVisible;

    public BannerRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getSubheadline() {
        return subheadline;
    }

    public void setSubheadline(String subheadline) {
        this.subheadline = subheadline;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getPrimaryButtonText() {
        return primaryButtonText;
    }

    public void setPrimaryButtonText(String primaryButtonText) {
        this.primaryButtonText = primaryButtonText;
    }

    public String getPrimaryButtonUrl() {
        return primaryButtonUrl;
    }

    public void setPrimaryButtonUrl(String primaryButtonUrl) {
        this.primaryButtonUrl = primaryButtonUrl;
    }

    public String getSecondaryButtonText() {
        return secondaryButtonText;
    }

    public void setSecondaryButtonText(String secondaryButtonText) {
        this.secondaryButtonText = secondaryButtonText;
    }

    public String getSecondaryButtonUrl() {
        return secondaryButtonUrl;
    }

    public void setSecondaryButtonUrl(String secondaryButtonUrl) {
        this.secondaryButtonUrl = secondaryButtonUrl;
    }

    public String getDesktopImage() {
        return desktopImage;
    }

    public void setDesktopImage(String desktopImage) {
        this.desktopImage = desktopImage;
    }

    public String getMobileImage() {
        return mobileImage;
    }

    public void setMobileImage(String mobileImage) {
        this.mobileImage = mobileImage;
    }

    public String getImageAlt() {
        return imageAlt;
    }

    public void setImageAlt(String imageAlt) {
        this.imageAlt = imageAlt;
    }

    public String getTextAlign() {
        return textAlign;
    }

    public void setTextAlign(String textAlign) {
        this.textAlign = textAlign;
    }

    public String getTextColorTheme() {
        return textColorTheme;
    }

    public void setTextColorTheme(String textColorTheme) {
        this.textColorTheme = textColorTheme;
    }

    public String getOverlayColor() {
        return overlayColor;
    }

    public void setOverlayColor(String overlayColor) {
        this.overlayColor = overlayColor;
    }

    public Double getOverlayOpacity() {
        return overlayOpacity;
    }

    public void setOverlayOpacity(Double overlayOpacity) {
        this.overlayOpacity = overlayOpacity;
    }

    public Boolean getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(Boolean visible) {
        isVisible = visible;
    }
}

