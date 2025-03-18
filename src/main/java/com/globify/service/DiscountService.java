package com.globify.service;

import com.globify.entity.Discount;
import com.globify.repository.DiscountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    // 🔹 Akció alkalmazása
    public BigDecimal applyDiscount(String discountName) {
        Optional<Discount> discount = discountRepository.findByName(discountName);

        if (discount.isPresent()) {
            Discount d = discount.get();
            if ((d.getValidFrom() != null && d.getValidFrom().isAfter(LocalDateTime.now())) ||
                    (d.getValidUntil() != null && d.getValidUntil().isBefore(LocalDateTime.now()))) {
                throw new IllegalArgumentException("Az akció lejárt vagy még nem aktív.");
            }
            return d.getDiscountPercentage();
        }
        throw new IllegalArgumentException("Érvénytelen akció neve.");
    }

    // ✅ Összes kedvezmény lekérdezése
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    // ✅ Akció lekérdezése név alapján
    public Optional<Discount> getDiscountByName(String name) {
        return discountRepository.findByName(name);
    }

    // ✅ Új akció létrehozása
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    // ✅ Akció törlése
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }
}
