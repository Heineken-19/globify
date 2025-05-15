package com.globify.specification;

import com.globify.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> isNew() {
        return (root, query, cb) -> cb.isTrue(root.get("isNew"));
    }

    public static Specification<Product> isSale() {
        return (root, query, cb) -> cb.isTrue(root.get("isSale"));
    }

    // Itt később bővíthetsz további speciális szűrőket is
}
