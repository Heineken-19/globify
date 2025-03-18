package com.globify.controller;

import com.globify.dto.AdminOrderDTO;

import com.globify.entity.OrderStatus;
import com.globify.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @GetMapping
    public ResponseEntity<List<AdminOrderDTO>> getAllOrders() {
        List<AdminOrderDTO> orders = orderService.getAllOrders(); // ✅ Közvetlenül visszaadjuk
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusValue = request.get("status");
        OrderStatus status;

        try {
            status = OrderStatus.valueOf(statusValue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Érvénytelen rendelési státusz: " + statusValue);
        }

        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok("Rendelés státusza frissítve: " + status);
    }


}
