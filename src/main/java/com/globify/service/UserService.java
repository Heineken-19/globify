package com.globify.service;

import com.globify.dto.UserProfileDTO;
import com.globify.entity.User;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔹 Profil lekérdezése
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));
        return new UserProfileDTO(user);
    }

    // 🔹 Profil frissítése
    public UserProfileDTO updateUserProfile(String email, UserProfileDTO updatedProfile) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));

        // 🔹 Csak azokat a mezőket frissítjük, amelyeket a frontend küldött
        if (updatedProfile.getFirstName() != null) {
            user.setFirstName(updatedProfile.getFirstName());
        }
        if (updatedProfile.getLastName() != null) {
            user.setLastName(updatedProfile.getLastName());
        }
        if (updatedProfile.getNickname() != null) {
            user.setNickname(updatedProfile.getNickname());
        }
        if (updatedProfile.getBirthDate() != null) {
            user.setBirthDate(updatedProfile.getBirthDate());
        }
        if (updatedProfile.getPhone() != null) {
            user.setPhone(updatedProfile.getPhone());
        }
        if (updatedProfile.getAvatar() != null) {
            user.setAvatar(updatedProfile.getAvatar());
        }

        userRepository.save(user);
        return new UserProfileDTO(user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ Felhasználó nem található."));
    }
}
