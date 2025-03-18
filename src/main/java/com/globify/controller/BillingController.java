package com.globify.controller;

import com.globify.entity.Billing;
import com.globify.entity.User;
import com.globify.repository.BillingRepository;
import com.globify.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingRepository billingRepository;
    private final UserRepository userRepository;

    public BillingController(BillingRepository billingRepository, UserRepository userRepository) {
        this.billingRepository = billingRepository;
        this.userRepository = userRepository;
    }

    // 🔹 1️⃣ Felhasználó számlázási adatainak lekérdezése
    @GetMapping
    public ResponseEntity<List<Billing>> getUserBilling(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Billing> billingList = billingRepository.findByUserId(user.get().getId());
        return ResponseEntity.ok(billingList);
    }

    // 🔹 2️⃣ Új számlázási adat hozzáadása
    @PostMapping
    public ResponseEntity<Billing> addBilling(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Billing newBilling) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        newBilling.setUser(user.get());
        Billing savedBilling = billingRepository.save(newBilling);
        return ResponseEntity.ok(savedBilling);
    }

    // 🔹 3️⃣ Számlázási adat módosítása
    @PutMapping("/{id}")
    public ResponseEntity<Billing> updateBilling(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody Billing updatedBilling) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        Optional<Billing> billingOptional = billingRepository.findById(id);

        if (user.isEmpty() || billingOptional.isEmpty() || !billingOptional.get().getUser().getId().equals(user.get().getId())) {
            return ResponseEntity.notFound().build();
        }

        Billing billing = billingOptional.get();
        billing.setCompanyName(updatedBilling.getCompanyName());
        billing.setTaxNumber(updatedBilling.getTaxNumber());
        billing.setStreet(updatedBilling.getStreet());
        billing.setCity(updatedBilling.getCity());
        billing.setPostalCode(updatedBilling.getPostalCode());
        billing.setCountry(updatedBilling.getCountry());

        Billing savedBilling = billingRepository.save(billing);
        return ResponseEntity.ok(savedBilling);
    }

    // 🔹 4️⃣ Számlázási adat törlése
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBilling(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        Optional<Billing> billingOptional = billingRepository.findById(id);

        if (user.isEmpty() || billingOptional.isEmpty() || !billingOptional.get().getUser().getId().equals(user.get().getId())) {
            return ResponseEntity.notFound().build();
        }

        billingRepository.deleteById(id);
        return ResponseEntity.ok().body("Billing data deleted successfully");
    }
}
