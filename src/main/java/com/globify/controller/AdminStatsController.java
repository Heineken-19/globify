package com.globify.controller;

import com.globify.service.AdminStatsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    public AdminStatsController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    // 🔹 1️⃣ Regisztrációk száma adott napon
    @GetMapping("/registrations")
    public ResponseEntity<List<Map<String, Object>>> getRegistrationsCount(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate == null || endDate == null) {
            endDate = LocalDate.now();
            startDate = endDate.minusDays(7); // Alapértelmezett: elmúlt 7 nap
        }

        return ResponseEntity.ok(adminStatsService.getRegistrationsCount(startDate, endDate));
    }


    // 🔹 1️⃣ Napi rendelés statisztika
    @GetMapping("/orders/stats")
    public ResponseEntity<Map<String, Object>> getDailyOrderStats(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(adminStatsService.getDailyOrderStats(date));
    }


    // 🔹 4️⃣ Bejelentkezések száma adott napon
    @GetMapping("/logins")
    public ResponseEntity<Map<String, Object>> getLoginsCount(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(adminStatsService.getLoginsCount(date));
    }

    // 🔹 Heti / havi bevétel statisztika
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats(@RequestParam String period) {
        return ResponseEntity.ok(adminStatsService.getRevenueStats(period));
    }

    // 🔹 Legtöbbet vásárolt termékek listázása
    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminStatsService.getTopProducts(limit));
    }

    @GetMapping("/user-activity")
    public ResponseEntity<List<Map<String, Object>>> getUserActivity() {
        return ResponseEntity.ok(adminStatsService.getUserActivity());
    }
}
