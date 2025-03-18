package com.globify.controller;

import com.globify.entity.Address;
import com.globify.entity.User;
import com.globify.repository.AddressRepository;
import com.globify.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // 🔹 1️⃣ Felhasználó összes címének lekérdezése
    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Address> addresses = addressRepository.findByUserId(user.get().getId());
        return ResponseEntity.ok(addresses);
    }

    // 🔹 Legutóbbi (alapértelmezett) cím lekérdezése
    @GetMapping("/default")
    public ResponseEntity<Address> getDefaultAddress(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return addressRepository.findByUserIdAndIsDefaultTrue(user.get().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 2️⃣ Új cím hozzáadása
    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Address newAddress) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        newAddress.setUser(user.get());

        // Ha az addressType nincs beállítva, akkor legyen "Otthoni"
        if (newAddress.getAddressType() == null || newAddress.getAddressType().isBlank()) {
            newAddress.setAddressType("Otthoni");
        }

        // Ha az új cím alapértelmezettként van megjelölve, a többi cím alapértelmezett státuszát töröljük
        if (Boolean.TRUE.equals(newAddress.getIsDefault())) {
            addressRepository.updateDefaultStatusForUser(user.get().getId());
        }

        Address savedAddress = addressRepository.save(newAddress);
        return ResponseEntity.ok(savedAddress);
    }

    // 🔹 3️⃣ Cím módosítása
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody Address updatedAddress) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        Optional<Address> addressOptional = addressRepository.findById(id);

        if (user.isEmpty() || addressOptional.isEmpty() || !addressOptional.get().getUser().getId().equals(user.get().getId())) {
            return ResponseEntity.notFound().build();
        }

        Address address = addressOptional.get();
        address.setStreet(updatedAddress.getStreet());
        address.setCity(updatedAddress.getCity());
        address.setPostalCode(updatedAddress.getPostalCode());
        address.setCountry(updatedAddress.getCountry());
        address.setAddressType(updatedAddress.getAddressType());

        // Ha az új cím alapértelmezettként van beállítva, a többi alapértelmezett cím törlésre kerül
        if (Boolean.TRUE.equals(updatedAddress.getIsDefault())) {
            addressRepository.updateDefaultStatusForUser(user.get().getId());
        }

        address.setIsDefault(updatedAddress.getIsDefault());
        Address savedAddress = addressRepository.save(address);
        return ResponseEntity.ok(savedAddress);
    }

    // 🔹 4️⃣ Cím törlése
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
        Optional<Address> addressOptional = addressRepository.findById(id);

        if (user.isEmpty() || addressOptional.isEmpty() || !addressOptional.get().getUser().getId().equals(user.get().getId())) {
            return ResponseEntity.notFound().build();
        }

        addressRepository.deleteById(id);
        return ResponseEntity.ok().body("Address deleted successfully");
    }
}
