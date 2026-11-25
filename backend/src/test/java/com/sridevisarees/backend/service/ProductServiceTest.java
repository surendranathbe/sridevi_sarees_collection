package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.ProductRequest;
import com.sridevisarees.backend.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private MongoTemplate mongoTemplate;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(mongoTemplate);
    }

    @Test
    void generateNextProductId_returnsFirstSequentialIdWhenEmpty() {
        when(mongoTemplate.findAll(Product.class, "uppada_silk")).thenReturn(List.of());
        when(mongoTemplate.collectionExists("products")).thenReturn(false);
        when(mongoTemplate.findOne(any(Query.class), eq(Product.class), anyString())).thenReturn(null);

        String nextId = productService.generateNextProductId("uppada-silk");
        assertEquals("uppada-01", nextId);
    }

    @Test
    void generateNextProductId_incrementsPastExistingProducts() {
        Product p1 = new Product("dola-01", "Saree 1", "royal-dola-silk", "", "https://example.com/1.jpg", "", 2500.0);
        Product p2 = new Product("dola-02", "Saree 2", "royal-dola-silk", "", "https://example.com/2.jpg", "", 3000.0);
        when(mongoTemplate.findAll(Product.class, "royal_dola_silk")).thenReturn(List.of(p1, p2));
        when(mongoTemplate.collectionExists("products")).thenReturn(false);
        when(mongoTemplate.findOne(any(Query.class), eq(Product.class), anyString())).thenReturn(null);

        String nextId = productService.generateNextProductId("royal-dola-silk");
        assertEquals("dola-03", nextId);
    }

    @Test
    void createProduct_savesIntoCategoryCollection() {
        when(mongoTemplate.findOne(any(Query.class), eq(Product.class), anyString())).thenReturn(null);
        when(mongoTemplate.collectionExists("products")).thenReturn(false);
        when(mongoTemplate.save(any(Product.class), eq("uppada_silk"))).thenAnswer(inv -> inv.getArgument(0));

        ProductRequest request = new ProductRequest(
                "uppada-01",
                "Uppada Silk Saree",
                "uppada-silk",
                "Pure silk weave",
                "http://localhost:8080/uploads/sample.jpg",
                "",
                2500.0
        );

        Product created = productService.createProduct(request);
        assertEquals("uppada-01", created.getProductId());
        assertEquals("uppada-silk", created.getCategory());
        verify(mongoTemplate).save(any(Product.class), eq("uppada_silk"));
    }

    @Test
    void createProduct_rejectsUnsafeImageUrl() {
        when(mongoTemplate.findOne(any(Query.class), eq(Product.class), anyString())).thenReturn(null);
        when(mongoTemplate.collectionExists("products")).thenReturn(false);

        ProductRequest request = new ProductRequest(
                "cotton-01",
                "Cotton Saree",
                "pure-cotton",
                "Desc",
                "javascript:alert(1)",
                "",
                1200.0
        );

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(request));
    }
}
