package com.globify.repository;

import com.globify.entity.ShippingMethod;
import com.globify.entity.ShippingRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShippingRateRepository extends JpaRepository<ShippingRate, Long> {

    Optional<ShippingRate> findByMethod(ShippingMethod method);
}
