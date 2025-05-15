package com.globify.controller;

import com.globify.dto.ShippingOptionDTO;
import com.globify.dto.UpdateShippingRequest;
import com.globify.entity.ShippingRate;
import com.globify.repository.ShippingRateRepository;
import com.globify.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/shipping")
public class AdminShippingController {


    private final AdminService adminService;
    private final ShippingRateRepository shippingRateRepository;

    public AdminShippingController(AdminService adminService, ShippingRateRepository shippingRateRepository) {
        this.adminService = adminService;
        this.shippingRateRepository = shippingRateRepository;
    }

    // ✅ 1️⃣ GET – Összes szállítási díj lekérdezése
    @GetMapping("/all")
    public List<ShippingOptionDTO> getAllRates() {
        return adminService.getAllShippingRates();
    }

    @GetMapping
    public List<ShippingRate> getAllShippingRates() {
        return shippingRateRepository.findAll();
    }

    // ✅ POST – Új szállítási díj létrehozása
    @PostMapping
    public ResponseEntity<?> createRate(@Valid @RequestBody ShippingOptionDTO dto) {
        if (dto.getMethod() == null) {
            return ResponseEntity.badRequest().body("Method is required");
        }

        ShippingRate newRate = new ShippingRate();
        newRate.setMethod(dto.getMethod());
        newRate.setPrice(dto.getPrice());

        shippingRateRepository.save(newRate);
        return ResponseEntity.ok(newRate);
    }

    // ✅ PUT – Szállítási díj módosítása
    @PutMapping("/{id}")
    public ResponseEntity<ShippingOptionDTO> updateRate(@PathVariable Long id,
                                                        @RequestBody UpdateShippingRequest request) {
        ShippingOptionDTO updated = adminService.updateShippingRateById(id, request.getPrice());
        return ResponseEntity.ok(updated);
    }

    // ✅ DELETE – Szállítási díj törlése
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRate(@PathVariable Long id) {
        adminService.deleteShippingRateById(id);
        return ResponseEntity.noContent().build();
    }
}
