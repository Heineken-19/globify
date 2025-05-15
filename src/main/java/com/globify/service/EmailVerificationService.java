package com.globify.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.globify.entity.EmailVerificationToken;
import com.globify.entity.User;
import com.globify.repository.EmailVerificationTokenRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @Transactional
    public String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        tokenRepository.deleteByUserId(user.getId());
        entityManager.flush();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);
        logger.info("📨 New token created for user: {}", user.getEmail());
        return token;
    }

    @Transactional
    public Optional<User> verifyEmail(String token) {
        Optional<EmailVerificationToken> verificationTokenOpt = tokenRepository.findByToken(token);

        if (verificationTokenOpt.isEmpty()) {
            logger.warn("A token nem található vagy törölve lett");
            return Optional.empty();
        }

        EmailVerificationToken verificationToken = verificationTokenOpt.get();

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.deleteByUserIdAndToken(verificationToken.getUser().getId(), token);
            entityManager.flush();
            logger.warn("Lejárt token, törölve");
            return Optional.empty();
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        tokenRepository.deleteByUserIdAndToken(user.getId(), token);
        entityManager.flush();
        logger.info("Email cím megerosítve a felhasználó számára: {}", user.getEmail());

        return Optional.of(user);
    }
}

