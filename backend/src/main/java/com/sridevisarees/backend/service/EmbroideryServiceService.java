package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.EmbroideryServiceRequest;
import com.sridevisarees.backend.model.EmbroideryService;
import com.sridevisarees.backend.repository.EmbroideryServiceRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class EmbroideryServiceService {

    private final EmbroideryServiceRepository repository;

    public EmbroideryServiceService(EmbroideryServiceRepository repository) {
        this.repository = repository;
    }

    public List<EmbroideryService> getAllServices() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<EmbroideryService> getServiceById(String serviceId) {
        return repository.findByServiceId(serviceId);
    }

    public EmbroideryService createService(EmbroideryServiceRequest request) {
        if (repository.existsByServiceId(request.getServiceId())) {
            throw new IllegalArgumentException("An embroidery service with ID '" + request.getServiceId() + "' already exists.");
        }

        EmbroideryService service = new EmbroideryService(
                request.getServiceId().trim(),
                request.getDesignName().trim(),
                request.getCategory().trim(),
                request.getCost(),
                request.getLeadTime() != null ? request.getLeadTime().trim() : "",
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getImageUrl() != null ? request.getImageUrl().trim() : ""
        );
        return repository.save(service);
    }

    public EmbroideryService updateService(String serviceId, EmbroideryServiceRequest request) {
        EmbroideryService existing = repository.findByServiceId(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Embroidery service not found with ID: " + serviceId));

        if (!existing.getServiceId().equalsIgnoreCase(request.getServiceId().trim())) {
            if (repository.existsByServiceId(request.getServiceId().trim())) {
                throw new IllegalArgumentException("Cannot rename: service ID '" + request.getServiceId() + "' is already in use.");
            }
            existing.setServiceId(request.getServiceId().trim());
        }

        existing.setDesignName(request.getDesignName().trim());
        existing.setCategory(request.getCategory().trim());
        existing.setCost(request.getCost());
        existing.setLeadTime(request.getLeadTime() != null ? request.getLeadTime().trim() : "");
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : "");
        existing.setUpdatedAt(Instant.now());

        return repository.save(existing);
    }

    public boolean deleteService(String serviceId) {
        Optional<EmbroideryService> service = repository.findByServiceId(serviceId);
        if (service.isPresent()) {
            repository.deleteByServiceId(serviceId);
            return true;
        }
        return false;
    }
}

