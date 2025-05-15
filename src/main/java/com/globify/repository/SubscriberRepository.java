package com.globify.repository;

import com.globify.entity.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Optional<Subscriber> findByEmail(String email);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
