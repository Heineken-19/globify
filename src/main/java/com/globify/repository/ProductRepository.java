package com.globify.repository;

import com.globify.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByIsNewTrueAndAvailableTrue(Pageable pageable);
    Page<Product> findByCategoryNameAndAvailableTrue(String categoryName, Pageable pageable);
    Page<Product> findByAvailableTrue(Pageable pageable);
    List<Product> findByIsNewTrueAndAvailableTrue();
    List<Product>findByIsSaleTrueAndAvailableTrue();

    // 🔹 Termékek ajánlása más vásárlók rendelései alapján
    @Query("SELECT oi.product FROM OrderItem oi " +
            "WHERE oi.order.id IN (SELECT oi2.order.id FROM OrderItem oi2 WHERE oi2.product.id = :productId) " +
            "AND oi.product.id <> :productId " +
            "GROUP BY oi.product " +
            "ORDER BY COUNT(oi.product.id) DESC")
    List<Product> findFrequentlyBoughtTogether(@Param("productId") Long productId);

    // 🔹 Alternatív ajánlás kategória alapján
    List<Product> findTop5ByCategoryIdAndIdNotOrderByPriceDesc(Long categoryId, Long productId);

    // 🔹 Csak az elérhető termékek lekérése képekkel együtt
    @Query("SELECT p FROM Product p WHERE p.available = true")
    List<Product> findAllAvailableWithImages();

    @Query("""
    SELECT oi.product.id FROM OrderItem oi
    WHERE oi.product.available = true
    GROUP BY oi.product.id
    ORDER BY COUNT(oi.id) DESC
""")
    List<Long> findMostPopularProductIds(Pageable pageable);

    Optional<Product> findBySlug(String slug);
}

