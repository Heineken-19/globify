package com.globify.service;

import com.globify.entity.User;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReferralCodeGeneratorService {

    private final UserRepository userRepository;

    public ReferralCodeGeneratorService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void generateReferralCodesForExistingUsers() {
        List<User> usersWithoutCode = userRepository.findByReferralCodeIsNull();

        for (User user : usersWithoutCode) {
            String code = generateUniqueReferralCode();
            user.setReferralCode(code);
            userRepository.save(user);
        }

        System.out.println("✅ Referral kódok generálása megtörtént a meglévő felhasználóknál.");
    }

    private String generateUniqueReferralCode() {
        String code;
        do {
            code = "GLOBI" + (int)(Math.random() * 100000);
        } while (userRepository.existsByReferralCode(code));
        return code;
    }
}
