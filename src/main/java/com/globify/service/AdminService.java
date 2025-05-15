package com.globify.service;

import com.globify.dto.ShippingOptionDTO;
import com.globify.dto.UserProfileDTO;
import com.globify.dto.AdminUserDTO;
import com.globify.entity.Role;
import com.globify.entity.ShippingMethod;
import com.globify.entity.ShippingRate;
import com.globify.entity.User;
import com.globify.repository.ShippingRateRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ShippingRateRepository shippingRateRepository;

    public AdminService(UserRepository userRepository, ShippingRateRepository shippingRateRepository) {
        this.userRepository = userRepository;
        this.shippingRateRepository = shippingRateRepository;
    }

    // 🔹 1️⃣ Összes felhasználó lekérdezése
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(AdminUserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 🔹 2️⃣ Felhasználó törlése
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // 🔹 3️⃣ Felhasználói szerepkör módosítása
    @Transactional
    public void updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (newRole == null) {
            throw new IllegalArgumentException("Invalid role");
        }

        user.setRole(newRole);
        userRepository.save(user);
    }

    // ✅ 1️⃣ Összes szállítási díj lekérdezése DTO-val
    public List<ShippingOptionDTO> getAllShippingRates() {
        return shippingRateRepository.findAll().stream()
                .map(rate -> new ShippingOptionDTO(rate.getId(), rate.getMethod(), rate.getPrice()))
                .collect(Collectors.toList());
    }

    // ✅ 2️⃣ Új szállítási díj létrehozása
    @Transactional
    public ShippingOptionDTO createShippingRate(ShippingMethod method, BigDecimal price) {
        if (shippingRateRepository.findByMethod(method).isPresent()) {
            throw new IllegalArgumentException("Shipping method already exists");
        }

        ShippingRate shippingRate = new ShippingRate();
        shippingRate.setMethod(method);
        shippingRate.setPrice(price);

        ShippingRate savedRate = shippingRateRepository.save(shippingRate);
        return new ShippingOptionDTO(savedRate.getId(), savedRate.getMethod(), savedRate.getPrice());
    }

    @Transactional
    public ShippingOptionDTO updateShippingRateById(Long id, BigDecimal price) {
        ShippingRate rate = shippingRateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid shipping rate ID"));

        rate.setPrice(price);
        ShippingRate updated = shippingRateRepository.save(rate);
        return new ShippingOptionDTO(updated.getId(), updated.getMethod(), updated.getPrice());
    }

    // ✅ 4️⃣ Szállítási díj törlése
    @Transactional
    public void deleteShippingRateById(Long id) {
        if (!shippingRateRepository.existsById(id)) {
            throw new IllegalArgumentException("Shipping rate not found");
        }
        shippingRateRepository.deleteById(id);
    }
}
