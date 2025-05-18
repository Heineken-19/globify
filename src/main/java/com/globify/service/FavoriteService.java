package com.globify.service;

import com.globify.dto.ProductDTO;
import com.globify.entity.Favorite;
import com.globify.entity.Product;
import com.globify.repository.FavoriteRepository;
import com.globify.repository.ProductRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // 🔹 Felhasználó kedvencei lekérdezése
    public List<ProductDTO> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(favorite -> new ProductDTO(favorite.getProduct()))
                .collect(Collectors.toList());
    }

    // 🔹 Kedvenc hozzáadása
    @Transactional
    public void addFavorite(Long userId, Long productId) {
        if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            Favorite favorite = new Favorite();
            favorite.setUser(userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Felhasználó nem található!")));
            favorite.setProduct(productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Termék nem található!")));
            favoriteRepository.save(favorite);
        }
    }

    // 🔹 Kedvenc eltávolítása
    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
