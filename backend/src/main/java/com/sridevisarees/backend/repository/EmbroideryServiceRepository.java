package com.sridevisarees.backend.repository;

import com.sridevisarees.backend.model.EmbroideryService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmbroideryServiceRepository extends MongoRepository<EmbroideryService, String> {
    Optional<EmbroideryService> findByServiceId(String serviceId);
    boolean existsByServiceId(String serviceId);
    void deleteByServiceId(String serviceId);
    List<EmbroideryService> findAllByOrderByCreatedAtDesc();
}

