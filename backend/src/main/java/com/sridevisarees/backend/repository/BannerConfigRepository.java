package com.sridevisarees.backend.repository;

import com.sridevisarees.backend.model.BannerConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerConfigRepository extends MongoRepository<BannerConfig, String> {
    Optional<BannerConfig> findFirstByIsDraftOrderByLastUpdatedDesc(boolean isDraft);
    void deleteAllByIsDraft(boolean isDraft);
}

