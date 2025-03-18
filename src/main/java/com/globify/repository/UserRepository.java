package com.globify.repository;

import com.globify.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByLastLoginBetween(LocalDateTime start, LocalDateTime end);
}