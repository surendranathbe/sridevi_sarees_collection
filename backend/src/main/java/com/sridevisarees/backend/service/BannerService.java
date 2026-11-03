package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.BannerRequest;
import com.sridevisarees.backend.model.BannerConfig;
import com.sridevisarees.backend.repository.BannerConfigRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class BannerService {

    private final BannerConfigRepository repository;

    public BannerService(BannerConfigRepository repository) {
        this.repository = repository;
    }

    public BannerConfig getPublishedBanner() {
        return repository.findFirstByIsDraftOrderByLastUpdatedDesc(false)
                .orElseGet(this::createFactoryDefaultBanner);
    }

    public BannerConfig getDraftBanner() {
        return repository.findFirstByIsDraftOrderByLastUpdatedDesc(true)
                .orElseGet(this::getPublishedBanner);
    }

    public BannerConfig saveDraftBanner(BannerRequest request, String adminEmail) {
        BannerConfig draft = repository.findFirstByIsDraftOrderByLastUpdatedDesc(true)
                .orElseGet(BannerConfig::new);

        applyRequestToEntity(request, draft);
        draft.setIsDraft(true);
        draft.setLastUpdated(Instant.now());
        draft.setUpdatedBy(adminEmail != null ? adminEmail : "Administrator");

        return repository.save(draft);
    }

    public BannerConfig publishBanner(BannerRequest request, String adminEmail) {
        // Save as published
        BannerConfig published = repository.findFirstByIsDraftOrderByLastUpdatedDesc(false)
                .orElseGet(BannerConfig::new);

        applyRequestToEntity(request, published);
        published.setIsDraft(false);
        published.setLastUpdated(Instant.now());
        published.setUpdatedBy(adminEmail != null ? adminEmail : "Administrator");
        BannerConfig saved = repository.save(published);

        // Also update draft to match published
        saveDraftBanner(request, adminEmail);

        return saved;
    }

    public BannerConfig resetToDefaults(String adminEmail) {
        repository.deleteAllByIsDraft(true);
        repository.deleteAllByIsDraft(false);

        BannerConfig defaultBanner = createFactoryDefaultBanner();
        defaultBanner.setUpdatedBy(adminEmail != null ? adminEmail : "Administrator");
        defaultBanner.setLastUpdated(Instant.now());
        return repository.save(defaultBanner);
    }

    private void applyRequestToEntity(BannerRequest request, BannerConfig entity) {
        entity.setTitle(request.getTitle().trim());
        entity.setSubtitle(request.getSubtitle() != null ? request.getSubtitle().trim() : "");
        entity.setSubheadline(request.getSubheadline().trim());
        entity.setDescription(request.getDescription().trim());
        entity.setTag(request.getTag() != null ? request.getTag().trim() : "PREMIUM COLLECTION");

        entity.setPrimaryButtonText(request.getPrimaryButtonText().trim());
        entity.setPrimaryButtonUrl(request.getPrimaryButtonUrl().trim());
        entity.setSecondaryButtonText(request.getSecondaryButtonText() != null ? request.getSecondaryButtonText().trim() : "");
        entity.setSecondaryButtonUrl(request.getSecondaryButtonUrl() != null ? request.getSecondaryButtonUrl().trim() : "");

        entity.setDesktopImage(request.getDesktopImage().trim());
        entity.setMobileImage(request.getMobileImage() != null ? request.getMobileImage().trim() : "");
        entity.setImageAlt(request.getImageAlt() != null ? request.getImageAlt().trim() : "Sridevi Sarees Showcase Banner");

        entity.setTextAlign(request.getTextAlign() != null ? request.getTextAlign() : "left");
        entity.setTextColorTheme(request.getTextColorTheme() != null ? request.getTextColorTheme() : "gold-ivory");
        entity.setOverlayColor(request.getOverlayColor() != null ? request.getOverlayColor() : "#1a050d");
        entity.setOverlayOpacity(request.getOverlayOpacity() != null ? request.getOverlayOpacity() : 0.25);
        entity.setIsVisible(request.getIsVisible() != null ? request.getIsVisible() : true);
    }

    public BannerConfig createFactoryDefaultBanner() {
        BannerConfig b = new BannerConfig();
        b.setTitle("Silk Sarees");
        b.setSubtitle("Dola Silk • Kanchipuram • Banarasi • Pure Silk");
        b.setSubheadline("Pure Kanchipuram, Banarasi & Dola Silk");
        b.setDescription("Experience regal grace with our authentic silk collection, hand-woven with shimmering zari borders and time-honored heritage motifs.");
        b.setTag("PREMIUM COLLECTION");
        b.setPrimaryButtonText("EXPLORE COLLECTION");
        b.setPrimaryButtonUrl("#collection-anchor");
        b.setSecondaryButtonText("View All Sarees");
        b.setSecondaryButtonUrl("#view-all");
        b.setDesktopImage("src/assets/silk-sarees-banner1.png");
        b.setMobileImage("");
        b.setImageAlt("Sridevi Sarees & Collections Pure Silk Showcase Banner");
        b.setTextAlign("left");
        b.setTextColorTheme("gold-ivory");
        b.setOverlayColor("#1a050d");
        b.setOverlayOpacity(0.25);
        b.setIsVisible(true);
        b.setIsDraft(false);
        b.setUpdatedBy("Factory Default");
        return b;
    }
}

