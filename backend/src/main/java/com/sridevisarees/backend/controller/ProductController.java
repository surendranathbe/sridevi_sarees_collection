package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.dto.ProductRequest;
import com.sridevisarees.backend.model.Product;
import com.sridevisarees.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Public storefront endpoint: list all products or filter by saree category.
     */
    @GetMapping("/api/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(
            @RequestParam(required = false) String category) {
        List<Product> products = (category != null && !category.isBlank())
                ? productService.getProductsByCategory(category)
                : productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved.", products));
    }

    /**
     * Public storefront endpoint: list products for a dedicated saree category page.
     */
    @GetMapping("/api/products/category/{category}")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Category products retrieved.", products));
    }

    /**
     * Public storefront endpoint: get product details by productId.
     */
    @GetMapping("/api/products/{productId}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String productId) {
        return productService.getProductByProductId(productId)
                .map(p -> ResponseEntity.ok(ApiResponse.success("Product found.", p)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Product not found with ID: " + productId)));
    }

    /**
     * Admin endpoint: generate next sequential product ID for a given category (e.g., "dola-01").
     */
    @GetMapping("/api/admin/products/next-id")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.Map<String, String>>> getNextProductId(
            @RequestParam String category) {
        String nextId = productService.generateNextProductId(category);
        return ResponseEntity.ok(ApiResponse.success("Next product ID generated.",
                java.util.Map.of("category", category, "nextProductId", nextId)));
    }

    /**
     * Admin endpoint: create product.
     */
    @PostMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully.", created));
    }

    /**
     * Admin endpoint: create product directly under a category collection.
     */
    @PostMapping("/api/admin/products/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> createProductInCategory(
            @PathVariable String category,
            @Valid @RequestBody ProductRequest request) {
        request.setCategory(category);
        Product created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully.", created));
    }

    /**
     * Admin endpoint: update product.
     */
    @PutMapping("/api/admin/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String productId,
            @Valid @RequestBody ProductRequest request) {
        Product updated = productService.updateProduct(productId, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully.", updated));
    }

    /**
     * Admin endpoint: update product directly within a category collection.
     */
    @PutMapping("/api/admin/products/category/{category}/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProductInCategory(
            @PathVariable String category,
            @PathVariable String productId,
            @Valid @RequestBody ProductRequest request) {
        request.setCategory(category);
        Product updated = productService.updateProduct(productId, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully.", updated));
    }

    /**
     * Admin endpoint: delete product.
     */
    @DeleteMapping("/api/admin/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String productId) {
        boolean deleted = productService.deleteProduct(productId);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully.", null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Product not found with ID: " + productId));
    }

    /**
     * Admin endpoint: delete product directly from a category collection.
     */
    @DeleteMapping("/api/admin/products/category/{category}/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProductInCategory(
            @PathVariable String category,
            @PathVariable String productId) {
        boolean deleted = productService.deleteProductInCategory(category, productId);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully.", null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Product not found with ID: " + productId));
    }
}

