package com.sridevisarees.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "banner_configs")
public class BannerConfig {

    @Id
    private String id;

    private String title;
    private String subtitle;
    private String subheadline;
    private String description;
    private String tag;

    private String primaryButtonText;
    private String primaryButtonUrl;
    private String secondaryButtonText;
    private String secondaryButtonUrl;

    private String desktopImage;
    private String mobileImage;
    private String imageAlt;

    private String textAlign;
    private String textColorTheme;
    private String overlayColor;
    private Double overlayOpacity;
    private Boolean isVisible;

    private Boolean isDraft;
    private Instant lastUpdated;
    private String updatedBy;

    public BannerConfig() {
        this.lastUpdated = Instant.now();
        this.isDraft = false;
        this.isVisible = true;
        this.overlayOpacity = 0.25;
        this.textAlign = "left";
        this.textColorTheme = "gold-ivory";
        this.overlayColor = "#1a050d";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Boolean getIsDraft() {
        return isDraft;
    }

    public void setIsDraft(Boolean draft) {
        isDraft = draft;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}

