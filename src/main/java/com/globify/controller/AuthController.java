package com.globify.controller;

import com.globify.dto.*;
import com.globify.dto.LoginRequest;
import com.globify.dto.RegisterRequest;
import com.globify.entity.Role;
import com.globify.entity.User;
import com.globify.repository.UserRepository;
import com.globify.security.JwtUtil;
import com.globify.service.EmailService;
import com.globify.service.EmailVerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, EmailService emailService,EmailVerificationService emailVerificationService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.emailVerificationService = emailVerificationService;
    }

    // Bejelentkezés
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) { // @RequestBody a JSON-hez
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user_id", user.getId());
        response.put("role", user.getRole().name());

        logger.info("✅ Bejelentkezés sikeres: {}", user.getEmail());
        return ResponseEntity.ok(response);

    }

    // Regisztráció
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) { // @RequestBody a JSON-hez
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .emailVerified(false)
                .build();

        userRepository.save(user);

        String token = emailVerificationService.generateVerificationToken(user);
        emailService.sendEmailVerification(user.getEmail(), token);

        logger.info("📩 Regisztráció sikeres, email küldve: {}", user.getEmail());
        return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");

    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean verified = emailVerificationService.verifyEmail(token);
        if (verified) {
            logger.info("✅ Email megerősítve: {}", token);
            return ResponseEntity.ok("Email verified successfully. You can now log in.");
        } else {
            logger.warn("⛔ Érvénytelen email megerősítési token: {}", token);
            return ResponseEntity.badRequest().body("Invalid or expired verification token.");
        }
    }

    // ✅ Jelszó-visszaállító email küldése
    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            logger.warn("🔍 Nem található felhasználó ezzel az email címmel: {}", request.getEmail());
            return ResponseEntity.badRequest().body("Nem található felhasználó ezzel az email címmel.");
        }

        User user = userOptional.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        logger.info("📩 Jelszó-visszaállító email kiküldve: {}", user.getEmail());
        return ResponseEntity.ok("Jelszó-visszaállító email elküldve.");
    }

    // ✅ Jelszó módosítása token alapján
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordUpdateRequest request) {
        String email = jwtUtil.validateToken(request.getToken());

        if (email == null) {
            logger.warn("⛔ Érvénytelen vagy lejárt token: {}", request.getToken());
            return ResponseEntity.badRequest().body("Érvénytelen vagy lejárt token.");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            logger.warn("🔍 Nem található felhasználó az érvényes tokennel.");
            return ResponseEntity.badRequest().body("Nem található felhasználó.");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Új jelszó titkosítása
        userRepository.save(user);

        logger.info("✅ Jelszó sikeresen módosítva: {}", user.getEmail());
        return ResponseEntity.ok("Jelszó sikeresen visszaállítva.");
    }
}

