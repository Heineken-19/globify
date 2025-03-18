package com.globify.service;

import com.globify.entity.ShippingMethod;
import com.globify.entity.ShippingRate;
import com.globify.repository.ShippingRateRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ShippingService {

    private final ShippingRateRepository shippingRateRepository;

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("20000"); // 20.000 Ft felett ingyenes

    public ShippingService(ShippingRateRepository shippingRateRepository) {
        this.shippingRateRepository = shippingRateRepository;
    }

    public BigDecimal calculateShippingCost(BigDecimal totalAmount, ShippingMethod method) {
        if (totalAmount.compareTo(FREE_SHIPPING_THRESHOLD) >= 0) {
            return BigDecimal.ZERO; // Ingyenes szállítás
        }

        return shippingRateRepository.findByMethod(method)
                .map(ShippingRate::getPrice)
                .orElseThrow(() -> new IllegalArgumentException("Shipping method not found"));
    }
}
