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
     * Public storefront endpoint: list all products.
     */
    @GetMapping("/api/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved.", products));
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
}

