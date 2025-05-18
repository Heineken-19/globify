package com.globify.controller;

import com.globify.config.SecurityConfig;
import com.globify.dto.*;
import com.globify.dto.LoginRequest;
import com.globify.dto.RegisterRequest;
import com.globify.entity.Role;
import com.globify.entity.User;
import com.globify.exception.EmailAlreadyUsedException;
import com.globify.exception.InvalidEmailFormatException;
import com.globify.repository.UserRepository;
import com.globify.security.JwtUtil;
import com.globify.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${frontend.url}")
    private String frontendUrl;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;
    private final RewardPointService rewardPointService;
    private final GuestAuthService guestAuthService;
    private final SecurityConfig securityConfig;

    // Bejelentkezés
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user_id", user.getId());
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body("Hiányzó refresh token.");
        }

        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Érvénytelen vagy lejárt refresh token.");
        }

        String email = jwtUtil.extractUsername(refreshToken);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Felhasználó nem található.");
        }

        User user = userOpt.get();
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();

        if (!securityConfig.isRequestAllowed(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Túl sok próbálkozás. Próbálja újra később.");
        }

        if (!request.getEmail().contains("@") || !request.getEmail().contains(".")) {
            throw new InvalidEmailFormatException("Az Email cím nem megfelelő");
        }

        if (request.getPassword().length() < 6
                || !request.getPassword().matches(".*[A-Z].*") // nagybetű
                || !request.getPassword().matches(".*[0-9].*") // szám
                || !request.getPassword().matches(".*[._\\-].*")) { // pont, kötőjel vagy alsó kötőjel
            return ResponseEntity.badRequest().body("A jelszónak legalább 6 karakter hosszúnak kell lennie, tartalmaznia kell nagybetűt, számot és speciális karaktert (., -, _).");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException("Ez az email cím már használatban van");
        }

        User referrer = null;
        if (request.getReferralCode() != null && !request.getReferralCode().isBlank()) {
            referrer = userRepository.findByReferralCode(request.getReferralCode()).orElse(null);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .emailVerified(false)
                .referralCode(generateUniqueReferralCode())
                .referredBy(referrer)
                .build();

        userRepository.save(user);


        String token = emailVerificationService.generateVerificationToken(user);
        emailService.sendEmailVerification(user.getEmail(), token);

        logger.info("📩 Regisztráció sikeres (meghívóval): {}", user.getEmail());
        return ResponseEntity.ok("Felhasználó sikeresen regisztrálva. Kérjük, erősítse meg az emailcímét.");

    }

    @PostMapping("/send-verification-email")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
        }

        User user = userOpt.get();

        if (user.isEmailVerified()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already verified."));
        }

        String token = emailVerificationService.generateVerificationToken(user);
        emailService.sendEmailVerification(user.getEmail(), token);

        return ResponseEntity.ok(Map.of("message", "Verification email sent."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        Optional<User> verifiedUserOpt = emailVerificationService.verifyEmail(token);

        if (verifiedUserOpt.isPresent()) {
            User user = verifiedUserOpt.get();
            // Csak akkor adjuk jóvá az 500 pontot, ha a felhasználónak van meghívója és még nem kapott jutalmat
            if (user.getReferredBy() != null && user.getReferralRewarded() == null) {
                User referrer = user.getReferredBy();
                rewardPointService.addPoints(referrer, 50000, "Meghívás jutalma: " + user.getEmail());
                user.setReferralRewarded(LocalDateTime.now());
                userRepository.save(user);
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Email verified successfully. You can now log in.",
                    "redirectUrl", "/login"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired verification token."));
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
        String token = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        logger.info("📩 Jelszó-visszaállító email kiküldve: {}", user.getEmail());
        return ResponseEntity.ok("Jelszó-visszaállító email elküldve.");
    }

    // ✅ Jelszó módosítása token alapján
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordUpdateRequest request) {
        if (!jwtUtil.validateToken(request.getToken())) {
            logger.warn("⛔ Érvénytelen vagy lejárt token: {}", request.getToken());
            return ResponseEntity.badRequest().body("Érvénytelen vagy lejárt token.");
        }

        String email = jwtUtil.extractUsername(request.getToken());

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (request.getNewPassword().length() < 6 ||
                !request.getNewPassword().matches(".*[A-Z].*") ||
                !request.getNewPassword().matches(".*[0-9].*") ||
                !request.getNewPassword().matches(".*[._\\-].*")) {
            return ResponseEntity.badRequest().body("A jelszónak legalább 6 karakter hosszúnak kell lennie, tartalmaznia kell nagybetűt, számot és speciális karaktert (., -, _).");
        }

        if (userOptional.isEmpty()) {
            logger.warn("🔍 Nem található felhasználó az érvényes tokennel.");
            return ResponseEntity.badRequest().body("Nem található felhasználó.");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        logger.info("✅ Jelszó sikeresen módosítva: {}", user.getEmail());
        return ResponseEntity.ok("Jelszó sikeresen visszaállítva.");
    }

    @PostMapping("/guest-checkout-link")
    public ResponseEntity<?> sendGuestCheckoutLink(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email mező nem lehet üres.");
        }

        String token = jwtUtil.generateAccessToken(email, "GUEST");
        emailService.sendGuestCartLink(email, token); // 🔹 Itt használjuk a metódust
        return ResponseEntity.ok("Email kiküldve");
    }



    @GetMapping("/validate-guest")
    public ResponseEntity<?> validateGuestToken(@RequestParam String token) {
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Érvénytelen vagy lejárt token.");
        }

        String email = jwtUtil.extractUsername(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Érvénytelen vagy lejárt token.");
        }

        // Itt válaszként visszaadjuk az email címet, hogy frontend is használni tudja
        return ResponseEntity.ok(Map.of("email", email));
    }

    private String generateUniqueReferralCode() {
        String code;
        do {
            code = "GLOBI" + (int)(Math.random() * 100000);
        } while (userRepository.existsByReferralCode(code));
        return code;
    }

}

