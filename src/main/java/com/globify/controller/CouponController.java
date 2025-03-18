package com.globify.controller;

import com.globify.entity.Coupon;
import com.globify.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    // 🔹 Összes kupon lekérdezése (admin funkció)
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // 🔹 Kupon lekérdezése kód alapján
    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getCoupon(@PathVariable String code) {
        return couponService.getCouponByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Új kupon létrehozása (admin funkció)
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    // 🔹 Kupon törlése (admin funkció)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Kupon érvényesítése (felhasználó használja rendelés során)
    @GetMapping("/apply")
    public ResponseEntity<BigDecimal> applyCoupon(@RequestParam String code, @RequestParam boolean isFirstOrder) {
        try {
            BigDecimal discount = couponService.applyCoupon(code, isFirstOrder);
            return ResponseEntity.ok(discount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(BigDecimal.ZERO);
        }
    }
}
