package com.globify.controller;

import com.globify.entity.Discount;
import com.globify.service.DiscountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    // 🔹 Összes akció lekérdezése (admin funkció)
    @GetMapping
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    // 🔹 Akció lekérdezése név alapján
    @GetMapping("/{name}")
    public ResponseEntity<Discount> getDiscount(@PathVariable String name) {
        return discountService.getDiscountByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Új akció létrehozása (admin funkció)
    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) {
        return ResponseEntity.ok(discountService.createDiscount(discount));
    }

    // 🔹 Akció törlése (admin funkció)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Akció érvényesítése (felhasználó rendelés közben)
    @GetMapping("/apply")
    public ResponseEntity<BigDecimal> applyDiscount(@RequestParam String name) {
        try {
            BigDecimal discount = discountService.applyDiscount(name);
            return ResponseEntity.ok(discount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(BigDecimal.ZERO);
        }
    }
}
