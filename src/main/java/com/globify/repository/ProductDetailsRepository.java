package com.globify.repository;

import com.globify.entity.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductDetailsRepository extends JpaRepository<ProductDetails, Long> {

    Optional<ProductDetails> findByProductId(Long productId);

    void deleteByProductId(Long productId);
}
