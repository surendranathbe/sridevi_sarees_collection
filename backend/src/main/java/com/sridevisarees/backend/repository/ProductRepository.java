package com.sridevisarees.backend.repository;

import com.sridevisarees.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findByProductId(String productId);
    boolean existsByProductId(String productId);
    void deleteByProductId(String productId);
    List<Product> findAllByOrderByCreatedAtDesc();
}

