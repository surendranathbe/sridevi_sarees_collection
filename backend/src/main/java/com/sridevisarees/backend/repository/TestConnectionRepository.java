package com.sridevisarees.backend.repository;

import com.sridevisarees.backend.model.TestConnectionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestConnectionRepository extends MongoRepository<TestConnectionDocument, String> {
    List<TestConnectionDocument> findTop10ByOrderByCreatedAtDesc();
}
