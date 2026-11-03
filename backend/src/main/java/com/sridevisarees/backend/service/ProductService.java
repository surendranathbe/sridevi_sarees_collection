package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.ProductRequest;
import com.sridevisarees.backend.model.Product;
import com.sridevisarees.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Product> getProductByProductId(String productId) {
        return productRepository.findByProductId(productId);
    }

    public Product createProduct(ProductRequest request) {
        if (productRepository.existsByProductId(request.getProductId())) {
            throw new IllegalArgumentException("A product with ID '" + request.getProductId() + "' already exists.");
        }

        Product product = new Product(
                request.getProductId().trim(),
                request.getName().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getFirstImageUrl().trim(),
                request.getHoverImageUrl() != null ? request.getHoverImageUrl().trim() : "",
                request.getCost()
        );
        return productRepository.save(product);
    }

    public Product updateProduct(String productId, ProductRequest request) {
        Product existing = productRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // If product ID is changing, ensure new ID is not already taken
        if (!existing.getProductId().equalsIgnoreCase(request.getProductId().trim())) {
            if (productRepository.existsByProductId(request.getProductId().trim())) {
                throw new IllegalArgumentException("Cannot rename: product ID '" + request.getProductId() + "' is already in use.");
            }
            existing.setProductId(request.getProductId().trim());
        }

        existing.setName(request.getName().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setFirstImageUrl(request.getFirstImageUrl().trim());
        existing.setHoverImageUrl(request.getHoverImageUrl() != null ? request.getHoverImageUrl().trim() : "");
        existing.setCost(request.getCost());
        existing.setUpdatedAt(Instant.now());

        return productRepository.save(existing);
    }

    public boolean deleteProduct(String productId) {
        Optional<Product> product = productRepository.findByProductId(productId);
        if (product.isPresent()) {
            productRepository.deleteByProductId(productId);
            return true;
        }
        return false;
    }
}

