package com.globify.repository;

import com.globify.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findAllByAvailableTrue();

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


}

