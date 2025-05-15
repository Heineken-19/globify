package com.globify.controller;

import com.globify.dto.CouponDTO;
import com.globify.entity.Coupon;
import com.globify.entity.RewardPoint;
import com.globify.entity.User;
import com.globify.repository.CouponRepository;
import com.globify.repository.RewardPointRepository;
import com.globify.repository.UserRepository;
import com.globify.security.CustomUserDetails;
import com.globify.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final RewardPointRepository rewardPointRepository;

    public CouponController(CouponService couponService,
                            UserRepository userRepository,
                            CouponRepository couponRepository,
                            RewardPointRepository rewardPointRepository) {
        this.couponService = couponService;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.rewardPointRepository = rewardPointRepository;
    }

    // 🔹 Összes kupon lekérdezése (admin funkció)
    @GetMapping
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
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
    public ResponseEntity<BigDecimal> applyCoupon(@RequestParam String code, @RequestParam boolean isFirstOrder,  @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            User user = userDetails.getUser();
            BigDecimal discount = couponService.applyCoupon(code, isFirstOrder, user);
            return ResponseEntity.ok(discount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(BigDecimal.ZERO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(BigDecimal.ZERO);
        }
    }

    @PostMapping("/reward")
    public ResponseEntity<?> generateRewardCoupon(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                  @RequestParam int discountPercentage) {
        try {
            User user = userDetails.getUser();
            int requiredPoints = (discountPercentage == 10) ? 2000 : (discountPercentage == 20) ? 4000 : -1;
            if (requiredPoints == -1) {
                return ResponseEntity.badRequest().body("Érvénytelen kedvezmény mérték");
            }

            if (user.getRewardPoints() < requiredPoints) {
                return ResponseEntity.badRequest().body("Nincs elegendő pont a kuponhoz");
            }

            String code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            Coupon coupon = new Coupon();
            coupon.setCode(code);
            coupon.setDiscountPercentage(BigDecimal.valueOf(discountPercentage));
            coupon.setFirstOrderOnly(false);
            coupon.setUser(user);
            coupon.setValidFrom(LocalDateTime.now());
            coupon.setValidUntil(LocalDateTime.now().plusMonths(1));
            couponRepository.save(coupon);

            user.setRewardPoints(user.getRewardPoints() - requiredPoints);
            userRepository.save(user);

            RewardPoint pointUsage = new RewardPoint();
            pointUsage.setUser(user);
            pointUsage.setPoints(-requiredPoints);
            pointUsage.setDescription("Pont beváltás kuponra (" + discountPercentage + "%)");
            pointUsage.setCreatedAt(LocalDateTime.now());
            rewardPointRepository.save(pointUsage);

            return ResponseEntity.ok(coupon);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hiba történt: " + e.getMessage());
        }
    }
}
