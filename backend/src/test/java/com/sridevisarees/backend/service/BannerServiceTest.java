package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.BannerRequest;
import com.sridevisarees.backend.model.BannerConfig;
import com.sridevisarees.backend.repository.BannerConfigRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class BannerServiceTest {

    private final Map<String, BannerConfig> storage = new HashMap<>();
    private BannerService bannerService;

    @BeforeEach
    void setUp() {
        storage.clear();

        BannerConfigRepository repo = (BannerConfigRepository) Proxy.newProxyInstance(
                BannerConfigRepository.class.getClassLoader(),
                new Class<?>[]{BannerConfigRepository.class},
                (proxy, method, args) -> {
                    if ("findFirstByIsDraftOrderByLastUpdatedDesc".equals(method.getName())) {
                        boolean isDraft = (boolean) args[0];
                        return storage.values().stream()
                                .filter(b -> b.getIsDraft() == isDraft)
                                .findFirst();
                    }
                    if ("save".equals(method.getName())) {
                        BannerConfig b = (BannerConfig) args[0];
                        String key = (b.getIsDraft() != null && b.getIsDraft()) ? "DRAFT" : "PUBLISHED";
                        b.setId(key);
                        storage.put(key, b);
                        return b;
                    }
                    if ("deleteAllByIsDraft".equals(method.getName())) {
                        boolean isDraft = (boolean) args[0];
                        String key = isDraft ? "DRAFT" : "PUBLISHED";
                        storage.remove(key);
                        return null;
                    }
                    return null;
                }
        );

        bannerService = new BannerService(repo);
    }

    @Test
    @DisplayName("Returns factory default banner when database is empty")
    void testGetPublishedBannerDefault() {
        BannerConfig config = bannerService.getPublishedBanner();
        assertNotNull(config);
        assertEquals("Silk Sarees", config.getTitle());
        assertEquals("Dola Silk • Kanchipuram • Banarasi • Pure Silk", config.getSubtitle());
        assertFalse(config.getIsDraft());
    }

    @Test
    @DisplayName("Saves draft banner and verifies draft does not overwrite published until publish call")
    void testDraftAndPublishSeparation() {
        BannerRequest draftReq = new BannerRequest();
        draftReq.setTitle("New Festive Saree Sale");
        draftReq.setSubheadline("Diwali Collection 2026");
        draftReq.setDescription("Exclusive 50% discount on all handloom sarees.");
        draftReq.setPrimaryButtonText("Shop Now");
        draftReq.setPrimaryButtonUrl("#shop");
        draftReq.setDesktopImage("/uploads/banner1.jpg");

        // Save draft
        BannerConfig savedDraft = bannerService.saveDraftBanner(draftReq, "admin@test.com");
        assertTrue(savedDraft.getIsDraft());
        assertEquals("New Festive Saree Sale", savedDraft.getTitle());

        // Published banner should still be the factory default
        BannerConfig publishedBefore = bannerService.getPublishedBanner();
        assertEquals("Silk Sarees", publishedBefore.getTitle());

        // Now publish
        BannerConfig publishedAfter = bannerService.publishBanner(draftReq, "admin@test.com");
        assertFalse(publishedAfter.getIsDraft());
        assertEquals("New Festive Saree Sale", publishedAfter.getTitle());

        // Now published banner is updated
        assertEquals("New Festive Saree Sale", bannerService.getPublishedBanner().getTitle());
    }
}

