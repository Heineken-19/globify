package com.globify.repository;

import com.globify.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // 🔹 Lekérdezi a legtöbbet vásárolt termékeket
    @Query("SELECT new map(oi.product.name as productName, SUM(oi.quantity) as totalSold) " +
            "FROM OrderItem oi GROUP BY oi.product.name ORDER BY totalSold DESC")
    List<Map<String, Object>> findTopProducts(Pageable pageable);
}
