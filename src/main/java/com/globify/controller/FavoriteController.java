package com.globify.controller;

import com.globify.dto.ProductDTO;
import com.globify.entity.Favorite;
import com.globify.service.FavoriteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/{userId}")
    public List<ProductDTO> getUserFavorites(@PathVariable Long userId) {
        return favoriteService.getUserFavorites(userId);
    }

    @PostMapping("/{userId}/{productId}")
    public String addFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        favoriteService.addFavorite(userId, productId);
        return "Termék hozzáadva a kedvencekhez!";
    }

    @DeleteMapping("/{userId}/{productId}")
    public String removeFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        favoriteService.removeFavorite(userId, productId);
        return "Termék eltávolítva a kedvencek közül!";
    }
}
