package com.globify.repository;

import com.globify.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BillingRepository extends JpaRepository<Billing, Long> {
    List<Billing> findByUserId(Long userId);
    Optional<Billing> findByUserIdAndBillingType(Long userId, String billingType);
}
