package com.globify.service;

import com.globify.dto.RewardPointDTO;
import com.globify.entity.RewardPoint;
import com.globify.entity.User;
import com.globify.repository.RewardPointRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardPointService {

    private final RewardPointRepository rewardPointRepository;
    private final UserRepository userRepository;

    public RewardPointService(RewardPointRepository rewardPointRepository, UserRepository userRepository) {
        this.rewardPointRepository = rewardPointRepository;
        this.userRepository = userRepository;
    }

    public List<RewardPointDTO> getPointsByUser(User user) {
        return rewardPointRepository.findByUser(user).stream()
                .map(rp -> new RewardPointDTO(rp.getPoints()))
                .collect(Collectors.toList());
    }

    public void addPoints(User user, int points, String description) {
        int adjustedPoints = points / 100; // ✅ csak itt osztjuk el 100-zal
        if (adjustedPoints <= 0) return;

        RewardPoint reward = new RewardPoint();
        reward.setUser(user);
        reward.setPoints(adjustedPoints);
        reward.setDescription(description);
        reward.setCreatedAt(LocalDateTime.now());
        rewardPointRepository.save(reward);

        user.setRewardPoints(user.getRewardPoints() + adjustedPoints);
        userRepository.save(user);
    }

    @Transactional
    public void usePoints(User user, int points, String description) {
        if (user.getRewardPoints() < points) {
            throw new IllegalArgumentException("Nincs elegendő pont");
        }
        user.setRewardPoints(user.getRewardPoints() - points);
        userRepository.save(user);

        RewardPoint point = new RewardPoint(user, -points, description);
        rewardPointRepository.save(point);
    }
}