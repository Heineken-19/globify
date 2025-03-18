package com.globify.controller;

import com.globify.dto.PickupPointDTO;
import com.globify.dto.UserProfileDTO;
import com.globify.entity.User;
import com.globify.service.UserService;
import com.globify.repository.FavoritePickupPointRepository;
import com.globify.service.FavoritePickupPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final FavoritePickupPointService favoritePickupPointService;

    @Autowired
    private FavoritePickupPointRepository favoritePickupPointRepository;

    public UserController(UserService userService, FavoritePickupPointService favoritePickupPointService) {
        this.userService = userService;
        this.favoritePickupPointService = favoritePickupPointService;
    }

    // 🔹 1️⃣ Felhasználói profil lekérdezése
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    // 🔹 2️⃣ Felhasználói profil módosítása
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserProfileDTO userProfileDTO) {
        return ResponseEntity.ok(userService.updateUserProfile(userDetails.getUsername(), userProfileDTO));
    }

    @PostMapping("/favorite-pickup-point")
    public ResponseEntity<?> saveFavoritePickupPoint(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PickupPointDTO dto) {

        User user = userService.getCurrentUser(userDetails.getUsername());
        favoritePickupPointService.saveFavoritePickupPoint(user, dto);

        return ResponseEntity.ok("✅ Kedvenc átvételi pont mentve!");
    }

    @GetMapping("/favorite-pickup-point")
    public ResponseEntity<?> getFavoritePickupPoint(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(favoritePickupPointService.getFavoritePickupPoint(user));
    }
}
