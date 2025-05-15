package com.globify.repository;

import com.globify.entity.RewardPoint;
import com.globify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardPointRepository extends JpaRepository<RewardPoint, Long> {
    List<RewardPoint> findByUser(User user);
}