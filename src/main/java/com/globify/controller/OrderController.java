package com.globify.controller;

import com.globify.dto.*;
import com.globify.entity.Order;
import com.globify.entity.User;
import com.globify.service.OrderService;
import com.globify.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody OrderRequestDTO orderRequestDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // ✅ Hívjuk meg az OrderService-t a rendelés mentésére
            Long orderId = orderService.createOrder(user.getEmail(), orderRequestDTO);

            if (orderId == null) {
                throw new RuntimeException("Order ID is null");
            }

            // ✅ Válaszban visszaküldjük az order ID-t JSON-ben
            return ResponseEntity.ok(Map.of("id", orderId));
        } catch (Exception e) {
            e.printStackTrace(); // Hiba kiírása logba
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to place order: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Page<UserOrderDTO>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Page<UserOrderDTO> orders = orderService.getUserOrders(user, page, size);

        // Ha nincs találat, akkor térjünk vissza egy üres oldallal
        if (orders.isEmpty()) {
            return ResponseEntity.ok(Page.empty());
        }

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        OrderDTO order = orderService.getOrderById(id, user);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        orderService.cancelOrder(id, user);
        return ResponseEntity.ok("Rendelés törölve!");
    }

    @PostMapping("/guest-orders")
    public ResponseEntity<?> placeGuestOrder(@RequestBody GuestOrderRequestDTO request) {
        Order order = orderService.placeGuestOrder(request);
        return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "email", order.getGuestEmail()
        ));
    }
}
