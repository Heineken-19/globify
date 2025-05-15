package com.globify.controller;

import com.globify.dto.*;
import com.globify.dto.LoginRequest;
import com.globify.dto.RegisterRequest;
import com.globify.entity.Role;
import com.globify.entity.User;
import com.globify.exception.EmailAlreadyUsedException;
import com.globify.exception.InvalidEmailFormatException;
import com.globify.repository.UserRepository;
import com.globify.security.JwtUtil;
import com.globify.service.EmailService;
import com.globify.service.EmailVerificationService;
import com.globify.service.GuestAuthService;
import com.globify.service.RewardPointService;
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

    // Bejelentkezés
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();

        if (!user.isEmailVerified()) {
            logger.warn("⛔ Bejelentkezési próbálkozás sikertelen, email nincs hitelesítve: {}", user.getEmail());
            return ResponseEntity.status(403).body("EMAIL_NOT_VERIFIED");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user_id", user.getId());
        response.put("role", user.getRole().name());

        logger.info("✅ Bejelentkezés sikeres: {}", user.getEmail());
        return ResponseEntity.ok(response);

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

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
        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Új jelszó titkosítása
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

        String token = jwtUtil.generateToken(email, "GUEST");
        emailService.sendGuestCartLink(email, token); // 🔹 Itt használjuk a metódust
        return ResponseEntity.ok("Email kiküldve");
    }



    @GetMapping("/validate-guest")
    public ResponseEntity<?> validateGuestToken(@RequestParam String token) {
        String email = jwtUtil.validateToken(token);
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

