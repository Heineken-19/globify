package com.globify.repository;

import com.globify.entity.FavoritePickupPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoritePickupPointRepository extends JpaRepository<FavoritePickupPoint, Long> {
    Optional<FavoritePickupPoint> findByUserId(Long userId);
}
