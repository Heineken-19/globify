package com.globify.controller;

import com.globify.entity.ShippingMethod;
import com.globify.service.ShippingService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    // 🔹 Szállítási költség lekérdezése
    @GetMapping("/check")
    public BigDecimal getShippingCost(@RequestParam BigDecimal totalAmount,
                                      @RequestParam ShippingMethod method) {
        return shippingService.calculateShippingCost(totalAmount, method);
    }

    // 🔹 Házhoz szállítás költsége
    @GetMapping("/home")
    public BigDecimal getHomeDeliveryCost(@RequestParam BigDecimal totalAmount) {
        return shippingService.calculateShippingCost(totalAmount, ShippingMethod.HOME_DELIVERY);
    }

    // 🔹 FoxPost költsége
    @GetMapping("/foxpost")
    public BigDecimal getFoxpostCost(@RequestParam BigDecimal totalAmount) {
        return shippingService.calculateShippingCost(totalAmount, ShippingMethod.FOXPOST);
    }

    // 🔹 Packeta költsége
    @GetMapping("/packeta")
    public BigDecimal getPacketaCost(@RequestParam BigDecimal totalAmount) {
        return shippingService.calculateShippingCost(totalAmount, ShippingMethod.PACKETA);
    }

    // 🔹 Üzletben átvétel költsége
    @GetMapping("/shop")
    public BigDecimal getShopCost(@RequestParam BigDecimal totalAmount) {
        return shippingService.calculateShippingCost(totalAmount, ShippingMethod.SHOP);
    }
}

