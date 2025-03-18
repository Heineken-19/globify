package com.globify.repository;

import com.globify.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Kedvencek lekérdezése adott felhasználó alapján
    List<Favorite> findByUserId(Long userId);

    // Kedvenc törlése adott felhasználótól és terméktől
    void deleteByUserIdAndProductId(Long userId, Long productId);

    // Ellenőrizzük, hogy egy termék már kedvenc-e adott felhasználónál
    boolean existsByUserIdAndProductId(Long userId, Long productId);
}

