package com.globify.service;

import com.globify.dto.FavoritePickupPointDTO;
import com.globify.dto.PickupPointDTO;
import com.globify.entity.FavoritePickupPoint;
import com.globify.entity.User;
import com.globify.repository.FavoritePickupPointRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FavoritePickupPointService {

    private final FavoritePickupPointRepository repository;

    public FavoritePickupPointService(FavoritePickupPointRepository repository) {
        this.repository = repository;
    }

    public void saveFavoritePickupPoint(User user, PickupPointDTO dto) {
        Optional<FavoritePickupPoint> existing = repository.findByUserId(user.getId());

        FavoritePickupPoint pickupPoint = existing.orElse(new FavoritePickupPoint());
        pickupPoint.setUser(user);
        pickupPoint.setPlaceId(dto.getPlaceId());
        pickupPoint.setName(dto.getName());
        pickupPoint.setCity(dto.getCity());
        pickupPoint.setZip(dto.getZip());
        pickupPoint.setAddress(dto.getAddress());

        repository.save(pickupPoint);
    }

    public FavoritePickupPointDTO getFavoritePickupPoint(User user) {
        return repository.findByUserId(user.getId())
                .map(point -> {
                    FavoritePickupPointDTO dto = new FavoritePickupPointDTO();
                    dto.setId(point.getId());
                    dto.setPlaceId(point.getPlaceId());
                    dto.setName(point.getName());
                    dto.setCity(point.getCity());
                    dto.setZip(point.getZip());
                    dto.setAddress(point.getAddress());
                    return dto;
                })
                .orElse(null);
    }
}
