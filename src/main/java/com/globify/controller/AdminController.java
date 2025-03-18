package com.globify.controller;

import com.globify.dto.AdminUserDTO;
import com.globify.entity.Role;

import com.globify.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Csak ADMIN férhet hozzá
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
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


}
