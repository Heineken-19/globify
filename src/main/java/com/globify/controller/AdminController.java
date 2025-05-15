package com.globify.controller;

import com.globify.dto.AdminUserDTO;
import com.globify.entity.Role;

import com.globify.service.AdminService;
import com.globify.service.AdminStatsService;
import com.globify.service.ReferralCodeGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Csak ADMIN férhet hozzá
public class AdminController {

    private final AdminService adminService;
    private final AdminStatsService adminStatsService;
    private final ReferralCodeGeneratorService referralCodeGeneratorService;

    public AdminController(AdminService adminService, ReferralCodeGeneratorService referralCodeGeneratorService, AdminStatsService adminStatsService) {
        this.adminService = adminService;
        this.referralCodeGeneratorService = referralCodeGeneratorService;
        this.adminStatsService = adminStatsService;
    }

    // 🔹 1️⃣ Összes felhasználó lekérdezése
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() { // ✅ Javítva
        List<AdminUserDTO> users = adminService.getAllUsers(); // ✅ Javítva
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("Felhasználó törölve!");
    }

    // 🔹 3️⃣ Felhasználó szerepkörének módosítása (USER → ADMIN vagy ADMIN → USER)
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long userId, @RequestParam String role) {
        adminService.updateUserRole(userId, Role.valueOf(role)); // ✅ Típuskonverzió
        return ResponseEntity.ok("Felhasználói szerepkör módosítva: " + role);
    }

    @PostMapping("/generate-referral-codes")
    public ResponseEntity<String> generateReferralCodes() {
        referralCodeGeneratorService.generateReferralCodesForExistingUsers();
        return ResponseEntity.ok("Referral kódok generálva.");
    }

    @GetMapping("/newsletter-subscriptions")
    public ResponseEntity<List<Map<String, Object>>> getDailyNewsletterStats(
            @RequestParam String startDate,
            @RequestParam String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(adminStatsService.getDailyNewsletterSubscriptions(start, end));
    }
}
