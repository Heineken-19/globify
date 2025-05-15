package com.globify.repository;

import com.globify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndEmailVerified(String email, boolean emailVerified);

    Optional<User> findByEmailVerified(boolean emailVerified);

    Optional<User> findByReferralCode(String referralCode);
    boolean existsByReferralCode(String referralCode);

    List<User> findByReferralCodeIsNull();


    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByLastLoginBetween(LocalDateTime start, LocalDateTime end);


}