package com.globify.specification;

import com.globify.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

public class ProductSpecification {

    public static Specification<Product> isNew(Boolean isNew) {
        return (root, query, cb) -> isNew == null ? cb.conjunction() : cb.equal(root.get("isNew"), isNew);
    }

    public static Specification<Product> isSale(Boolean isSale) {
        return (root, query, cb) -> isSale == null ? cb.conjunction() : cb.equal(root.get("isSale"), isSale);
    }

    public static Specification<Product> isAvailable(Boolean available) {
        return (root, query, cb) -> available == null ? cb.conjunction() : cb.equal(root.get("available"), available);
    }

    public static Specification<Product> hasCategory(List<String> categories) {
        return (root, query, cb) -> categories == null || categories.isEmpty() ?
                cb.conjunction() : root.get("category").get("name").in(categories);
    }

    public static Specification<Product> hasSearchTerm(String searchTerm) {
        return (root, query, cb) -> searchTerm == null || searchTerm.trim().isEmpty() ?
                cb.conjunction() : cb.like(cb.lower(root.get("name")), "%" + searchTerm.toLowerCase() + "%");
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) {
                return cb.conjunction();
            } else if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("price"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return cb.ge(root.get("price"), minPrice);
            } else {
                return cb.le(root.get("price"), maxPrice);
            }
        };
    }

    public static Specification<Product> hasSizeBetween(Double minSize, Double maxSize) {
        return (root, query, cb) -> {
            if (minSize == null && maxSize == null) {
                return cb.conjunction();
            } else if (minSize != null && maxSize != null) {
                return cb.between(root.get("mainSize"), minSize, maxSize);
            } else if (minSize != null) {
                return cb.ge(root.get("mainSize"), minSize);
            } else {
                return cb.le(root.get("mainSize"), maxSize);
            }
        };
    }

    public static Specification<Product> hasType(List<String> types) {
        return (root, query, cb) -> {
            if (types == null || types.isEmpty()) {
                return cb.conjunction();
            }
            Predicate[] typePredicates = types.stream()
                    .filter(Objects::nonNull)
                    .map(type -> cb.like(cb.lower(root.get("type")), "%" + type.toLowerCase() + "%"))
                    .toArray(Predicate[]::new);
            return cb.or(typePredicates);
        };
    }

    public static Specification<Product> hasLight(List<String> lightConditions) {
        return (root, query, cb) -> lightConditions == null || lightConditions.isEmpty() ?
                cb.conjunction() : root.join("productDetails").get("light").in(lightConditions);
    }

    public static Specification<Product> hasWater(List<String> waterConditions) {
        return (root, query, cb) -> waterConditions == null || waterConditions.isEmpty() ?
                cb.conjunction() : root.join("productDetails").get("water").in(waterConditions);
    }
}
