package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.EmbroideryServiceRequest;
import com.sridevisarees.backend.model.EmbroideryService;
import com.sridevisarees.backend.service.EmbroideryServiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EmbroideryServiceController {

    private final EmbroideryServiceService serviceService;

    public EmbroideryServiceController(EmbroideryServiceService serviceService) {
        this.serviceService = serviceService;
    }

    /**
     * Public storefront endpoint: list all embroidery services.
     */
    @GetMapping("/api/embroidery-services")
    public ResponseEntity<ApiResponse<List<EmbroideryService>>> getAllServices() {
        List<EmbroideryService> list = serviceService.getAllServices();
        return ResponseEntity.ok(ApiResponse.success("Embroidery services retrieved.", list));
    }

    /**
     * Public storefront endpoint: get embroidery service by ID.
     */
    @GetMapping("/api/embroidery-services/{serviceId}")
    public ResponseEntity<ApiResponse<EmbroideryService>> getServiceById(@PathVariable String serviceId) {
        return serviceService.getServiceById(serviceId)
                .map(s -> ResponseEntity.ok(ApiResponse.success("Service found.", s)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Embroidery service not found with ID: " + serviceId)));
    }

    /**
     * Admin endpoint: create embroidery service.
     */
    @PostMapping("/api/admin/embroidery-services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmbroideryService>> createService(@Valid @RequestBody EmbroideryServiceRequest request) {
        EmbroideryService created = serviceService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Embroidery service created successfully.", created));
    }

    /**
     * Admin endpoint: update embroidery service.
     */
    @PutMapping("/api/admin/embroidery-services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmbroideryService>> updateService(
            @PathVariable String serviceId,
            @Valid @RequestBody EmbroideryServiceRequest request) {
        EmbroideryService updated = serviceService.updateService(serviceId, request);
        return ResponseEntity.ok(ApiResponse.success("Embroidery service updated successfully.", updated));
    }

    /**
     * Admin endpoint: delete embroidery service.
     */
    @DeleteMapping("/api/admin/embroidery-services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable String serviceId) {
        boolean deleted = serviceService.deleteService(serviceId);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Embroidery service deleted successfully.", null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Embroidery service not found with ID: " + serviceId));
    }
}

