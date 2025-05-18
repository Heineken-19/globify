package com.globify.service;

import com.globify.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GuestAuthService {

    private final JwtUtil jwtUtil;

    public boolean isValidGuestToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            return false;
        }

        String role = jwtUtil.extractRole(token);
        return role != null && role.equals("GUEST");
    }

    public String extractEmailFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            return null; // Ha a token nem érvényes, akkor null-t adunk vissza
        }
        return jwtUtil.extractUsername(token); // A felhasználó email-címe
    }
}
