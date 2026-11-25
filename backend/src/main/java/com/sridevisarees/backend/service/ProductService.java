package com.sridevisarees.backend.service;

import com.sridevisarees.backend.dto.ProductRequest;
import com.sridevisarees.backend.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProductService {

    private static final String LEGACY_COLLECTION = "products";

    /**
     * Allowlisted mapping of each saree category ID to its dedicated MongoDB collection.
     */
    public static final Map<String, String> CATEGORY_COLLECTIONS = Map.of(
            "royal-dola-silk", "royal_dola_silk",
            "banarasi-silk", "banarasi_silk",
            "uppada-silk", "uppada_silk",
            "mangalagiri-pattu", "mangalagiri_pattu",
            "pure-handloom", "pure_handloom",
            "designer-silk", "designer_silk",
            "organza-tissue", "organza_tissue",
            "chanderi-maheshwari", "chanderi_maheshwari",
            "chiffon-georgette", "chiffon_georgette",
            "pure-cotton", "pure_cotton"
    );

    /**
     * Allowlisted mapping of each saree category ID to its auto-generated Product ID prefix (e.g. "dola-01").
     */
    public static final Map<String, String> CATEGORY_PREFIXES = Map.of(
            "royal-dola-silk", "dola",
            "banarasi-silk", "banarasi",
            "uppada-silk", "uppada",
            "mangalagiri-pattu", "mangalagiri",
            "pure-handloom", "handloom",
            "designer-silk", "designer",
            "organza-tissue", "organza",
            "chanderi-maheshwari", "chanderi",
            "chiffon-georgette", "chiffon",
            "pure-cotton", "cotton"
    );

    public static final Set<String> ALLOWED_CATEGORIES = CATEGORY_COLLECTIONS.keySet();

    private final MongoTemplate mongoTemplate;

    public ProductService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Product> getAllProducts() {
        List<Product> all = new ArrayList<>();
        Query sortedQuery = new Query().with(Sort.by(Sort.Direction.DESC, "createdAt"));
        for (String collectionName : CATEGORY_COLLECTIONS.values()) {
            all.addAll(mongoTemplate.find(sortedQuery, Product.class, collectionName));
        }
        // Include any legacy products stored in the old 'products' collection
        if (mongoTemplate.collectionExists(LEGACY_COLLECTION)) {
            all.addAll(mongoTemplate.find(sortedQuery, Product.class, LEGACY_COLLECTION));
        }
        all.sort(Comparator.comparing(
                (Product p) -> p.getCreatedAt() != null ? p.getCreatedAt() : Instant.EPOCH
        ).reversed());
        return all;
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category.trim())) {
            return getAllProducts();
        }
        String normalized = normalizeAndValidateCategory(category);
        String collectionName = CATEGORY_COLLECTIONS.get(normalized);
        Query sortedQuery = new Query().with(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Product> results = new ArrayList<>(mongoTemplate.find(sortedQuery, Product.class, collectionName));

        // Include any legacy products with matching category in the old 'products' collection
        if (mongoTemplate.collectionExists(LEGACY_COLLECTION)) {
            Query legacyQuery = new Query(Criteria.where("category").is(normalized))
                    .with(Sort.by(Sort.Direction.DESC, "createdAt"));
            results.addAll(mongoTemplate.find(legacyQuery, Product.class, LEGACY_COLLECTION));
        }
        return results;
    }

    public Optional<Product> getProductByProductId(String productId) {
        if (productId == null || productId.isBlank()) {
            return Optional.empty();
        }
        String trimmedId = productId.trim();
        Query query = new Query(Criteria.where("productId").is(trimmedId));
        for (String collectionName : CATEGORY_COLLECTIONS.values()) {
            Product found = mongoTemplate.findOne(query, Product.class, collectionName);
            if (found != null) {
                return Optional.of(found);
            }
        }
        if (mongoTemplate.collectionExists(LEGACY_COLLECTION)) {
            Product legacyFound = mongoTemplate.findOne(query, Product.class, LEGACY_COLLECTION);
            if (legacyFound != null) {
                return Optional.of(legacyFound);
            }
        }
        return Optional.empty();
    }

    /**
     * Computes the next sequential auto-generated Product ID for a category (e.g., "dola-01", "dola-02").
     */
    public String generateNextProductId(String category) {
        String normalized = normalizeAndValidateCategory(category);
        String prefix = CATEGORY_PREFIXES.get(normalized);
        String collectionName = CATEGORY_COLLECTIONS.get(normalized);

        Pattern suffixPattern = Pattern.compile("^" + Pattern.quote(prefix) + "-(\\d+)$", Pattern.CASE_INSENSITIVE);
        int maxNumber = 0;

        List<Product> existingInCategory = mongoTemplate.findAll(Product.class, collectionName);
        for (Product p : existingInCategory) {
            maxNumber = Math.max(maxNumber, extractSuffixNumber(p.getProductId(), suffixPattern));
        }

        if (mongoTemplate.collectionExists(LEGACY_COLLECTION)) {
            Query legacyQuery = new Query(Criteria.where("category").is(normalized));
            List<Product> legacyItems = mongoTemplate.find(legacyQuery, Product.class, LEGACY_COLLECTION);
            for (Product p : legacyItems) {
                maxNumber = Math.max(maxNumber, extractSuffixNumber(p.getProductId(), suffixPattern));
            }
        }

        int nextNumber = maxNumber + 1;
        String candidate = String.format("%s-%02d", prefix, nextNumber);
        while (existsByProductIdAnywhere(candidate)) {
            nextNumber++;
            candidate = String.format("%s-%02d", prefix, nextNumber);
        }
        return candidate;
    }

    private int extractSuffixNumber(String productId, Pattern pattern) {
        if (productId == null) return 0;
        Matcher matcher = pattern.matcher(productId.trim());
        if (matcher.matches()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }
        return 0;
    }

    private boolean existsByProductIdAnywhere(String productId) {
        return getProductByProductId(productId).isPresent();
    }

    public Product createProduct(ProductRequest request) {
        String normalizedCategory = normalizeAndValidateCategory(request.getCategory());
        String targetCollection = CATEGORY_COLLECTIONS.get(normalizedCategory);

        String requestedId = request.getProductId() != null ? request.getProductId().trim() : "";
        String finalProductId = requestedId.isBlank()
                ? generateNextProductId(normalizedCategory)
                : requestedId;

        if (existsByProductIdAnywhere(finalProductId)) {
            throw new IllegalArgumentException("A product with ID '" + finalProductId + "' already exists.");
        }

        String firstImg = validateSafeImageUrl(request.getFirstImageUrl(), "First image URL");
        String hoverImg = validateSafeOptionalImageUrl(request.getHoverImageUrl(), "Hover image URL");

        Product product = new Product(
                finalProductId,
                request.getName().trim(),
                normalizedCategory,
                request.getDescription() != null ? request.getDescription().trim() : "",
                firstImg,
                hoverImg,
                request.getCost()
        );
        return mongoTemplate.save(product, targetCollection);
    }

    public Product updateProduct(String productId, ProductRequest request) {
        String trimmedLookupId = productId != null ? productId.trim() : "";
        LocatedProduct located = findLocatedProduct(trimmedLookupId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + trimmedLookupId));

        Product existing = located.product();
        String oldCollection = located.collectionName();

        String normalizedCategory = normalizeAndValidateCategory(request.getCategory());
        String newCollection = CATEGORY_COLLECTIONS.get(normalizedCategory);

        String requestedId = request.getProductId() != null ? request.getProductId().trim() : "";
        String nextId = requestedId.isBlank() ? existing.getProductId() : requestedId;

        // If product ID is changing, ensure new ID is not already taken
        if (!existing.getProductId().equalsIgnoreCase(nextId)) {
            if (existsByProductIdAnywhere(nextId)) {
                throw new IllegalArgumentException("Cannot rename: product ID '" + nextId + "' is already in use.");
            }
            existing.setProductId(nextId);
        }

        String firstImg = validateSafeImageUrl(request.getFirstImageUrl(), "First image URL");
        String hoverImg = validateSafeOptionalImageUrl(request.getHoverImageUrl(), "Hover image URL");

        existing.setName(request.getName().trim());
        existing.setCategory(normalizedCategory);
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setFirstImageUrl(firstImg);
        existing.setHoverImageUrl(hoverImg);
        existing.setCost(request.getCost());
        existing.setUpdatedAt(Instant.now());

        // If category changed (or moving from legacy 'products' collection), move document to the new category collection
        if (!oldCollection.equals(newCollection)) {
            mongoTemplate.remove(new Query(Criteria.where("productId").is(trimmedLookupId)), oldCollection);
            existing.setId(null); // Let MongoDB assign a clean ObjectId in the target collection if needed
        }

        return mongoTemplate.save(existing, newCollection);
    }

    public boolean deleteProduct(String productId) {
        if (productId == null || productId.isBlank()) {
            return false;
        }
        String trimmedId = productId.trim();
        Optional<LocatedProduct> locatedOpt = findLocatedProduct(trimmedId);
        if (locatedOpt.isPresent()) {
            mongoTemplate.remove(new Query(Criteria.where("productId").is(trimmedId)), locatedOpt.get().collectionName());
            return true;
        }
        return false;
    }

    public boolean deleteProductInCategory(String category, String productId) {
        String normalized = normalizeAndValidateCategory(category);
        String collectionName = CATEGORY_COLLECTIONS.get(normalized);
        String trimmedId = productId != null ? productId.trim() : "";
        Query query = new Query(Criteria.where("productId").is(trimmedId));
        if (mongoTemplate.exists(query, Product.class, collectionName)) {
            mongoTemplate.remove(query, collectionName);
            return true;
        }
        return deleteProduct(trimmedId);
    }

    private Optional<LocatedProduct> findLocatedProduct(String productId) {
        Query query = new Query(Criteria.where("productId").is(productId));
        for (String collectionName : CATEGORY_COLLECTIONS.values()) {
            Product found = mongoTemplate.findOne(query, Product.class, collectionName);
            if (found != null) {
                return Optional.of(new LocatedProduct(found, collectionName));
            }
        }
        if (mongoTemplate.collectionExists(LEGACY_COLLECTION)) {
            Product legacyFound = mongoTemplate.findOne(query, Product.class, LEGACY_COLLECTION);
            if (legacyFound != null) {
                return Optional.of(new LocatedProduct(legacyFound, LEGACY_COLLECTION));
            }
        }
        return Optional.empty();
    }

    private record LocatedProduct(Product product, String collectionName) {}

    private String normalizeAndValidateCategory(String rawCategory) {
        if (rawCategory == null || rawCategory.isBlank()) {
            throw new IllegalArgumentException("Saree category is required.");
        }
        String normalized = rawCategory.trim().toLowerCase();
        if (!ALLOWED_CATEGORIES.contains(normalized)) {
            throw new IllegalArgumentException("Invalid saree category: '" + normalized + "'.");
        }
        return normalized;
    }

    private String validateSafeImageUrl(String url, String fieldLabel) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException(fieldLabel + " is required.");
        }
        String trimmed = url.trim();
        if (!isSafeImageScheme(trimmed)) {
            throw new IllegalArgumentException(fieldLabel + " must be a valid http(s) URL or /uploads/ path.");
        }
        return trimmed;
    }

    private String validateSafeOptionalImageUrl(String url, String fieldLabel) {
        if (url == null || url.isBlank()) {
            return "";
        }
        String trimmed = url.trim();
        if (!isSafeImageScheme(trimmed)) {
            throw new IllegalArgumentException(fieldLabel + " must be a valid http(s) URL or /uploads/ path.");
        }
        return trimmed;
    }

    private boolean isSafeImageScheme(String url) {
        String lower = url.toLowerCase();
        return lower.startsWith("https://")
                || lower.startsWith("http://")
                || lower.startsWith("/uploads/");
    }
}

