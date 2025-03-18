package com.globify.repository;

import com.globify.entity.OrderBilling;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderBillingRepository extends JpaRepository<OrderBilling, Long> {
}