package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.BannerRequest;
import com.sridevisarees.backend.model.BannerConfig;
import com.sridevisarees.backend.service.BannerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    /**
     * Public storefront endpoint: retrieves the currently published banner configuration.
     */
    @GetMapping("/api/banner")
    public ResponseEntity<ApiResponse<BannerConfig>> getPublishedBanner() {
        BannerConfig config = bannerService.getPublishedBanner();
        return ResponseEntity.ok(ApiResponse.success("Published banner retrieved.", config));
    }

    /**
     * Admin endpoint: gets the working draft banner.
     */
    @GetMapping("/api/admin/banner/draft")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerConfig>> getDraftBanner() {
        BannerConfig draft = bannerService.getDraftBanner();
        return ResponseEntity.ok(ApiResponse.success("Draft banner retrieved.", draft));
    }

    /**
     * Admin endpoint: saves draft banner without publishing.
     */
    @PostMapping("/api/admin/banner/draft")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerConfig>> saveDraftBanner(
            @Valid @RequestBody BannerRequest request,
            Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "Administrator";
        BannerConfig savedDraft = bannerService.saveDraftBanner(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Draft banner saved.", savedDraft));
    }

    /**
     * Admin endpoint: publishes banner to storefront.
     */
    @PostMapping("/api/admin/banner/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerConfig>> publishBanner(
            @Valid @RequestBody BannerRequest request,
            Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "Administrator";
        BannerConfig published = bannerService.publishBanner(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Banner published to storefront.", published));
    }

    /**
     * Admin endpoint: resets banner to factory defaults.
     */
    @PostMapping("/api/admin/banner/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerConfig>> resetBannerDefaults(Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "Administrator";
        BannerConfig reset = bannerService.resetToDefaults(adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Banner reset to factory defaults.", reset));
    }
}

