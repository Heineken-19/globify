package com.globify.service;

import com.globify.entity.Coupon;
import com.globify.entity.User;
import com.globify.dto.CouponDTO;
import com.globify.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    // 🔹 Kupon alkalmazása rendelésnél
    public BigDecimal applyCoupon(String code, boolean isFirstOrder, User user) {
        Optional<Coupon> coupon = couponRepository.findByCode(code);

        if (coupon.isPresent()) {
            Coupon c = coupon.get();

            if ((c.getValidFrom() != null && c.getValidFrom().isAfter(LocalDateTime.now())) ||
                    (c.getValidUntil() != null && c.getValidUntil().isBefore(LocalDateTime.now()))) {
                throw new IllegalArgumentException("A kupon lejárt vagy még nem aktív.");
            }
            if (c.isFirstOrderOnly() && !isFirstOrder) {
                throw new IllegalArgumentException("Ez a kupon csak első rendelésnél használható.");
            }

            if (c.getUser() != null && !c.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Ez a kupon nem hozzád tartozik.");
            }

            if (c.getUser() != null) {
                couponRepository.delete(c);
            }

            return c.getDiscountPercentage();
        }
        throw new IllegalArgumentException("Érvénytelen kuponkód.");
    }

    // ✅ Összes kupon lekérdezése
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(c -> CouponDTO.builder()
                        .id(c.getId())
                        .code(c.getCode())
                        .discountPercentage(c.getDiscountPercentage())
                        .validFrom(c.getValidFrom())
                        .validUntil(c.getValidUntil())
                        .firstOrderOnly(c.isFirstOrderOnly())
                        .userId(c.getUser() != null ? c.getUser().getId() : null)
                        .userEmail(c.getUser() != null ? c.getUser().getEmail() : null)
                        .build())
                .toList();
    }

    // ✅ Kupon lekérdezése kód alapján
    public Optional<Coupon> getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }

    // ✅ Új kupon létrehozása
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    // ✅ Kupon törlése
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}
