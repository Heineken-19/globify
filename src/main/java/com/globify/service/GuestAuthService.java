package com.globify.service;

import com.globify.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GuestAuthService {

    private final JwtUtil jwtUtil;

    public boolean isValidGuestToken(String token) {
        String email = jwtUtil.validateToken(token);
        String role = jwtUtil.extractRole(token);

        return email != null && role != null && role.equals("GUEST");
    }

    public String extractEmailFromToken(String token) {
        return jwtUtil.validateToken(token); // ugyanazt használjuk, ami a user emailt visszaadja
    }
}
