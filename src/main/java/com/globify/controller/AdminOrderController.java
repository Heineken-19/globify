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

    @PutMapping("/status")
    public ResponseEntity<String> bulkUpdateOrderStatus(@RequestBody Map<String, Object> request) {
        List<Long> orderIds = (List<Long>) request.get("orderIds");
        String statusValue = (String) request.get("status");

        OrderStatus status;
        try {
            status = OrderStatus.valueOf(statusValue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Érvénytelen rendelési státusz: " + statusValue);
        }

        orderIds.forEach(orderId -> orderService.queueOrderStatusUpdate(orderId, status));

        return ResponseEntity.ok("✅ Rendelések státusza frissítési sorba helyezve: " + status);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusValue = request.get("status");
        OrderStatus status = OrderStatus.valueOf(statusValue);

        // Státusz frissítés sorba helyezése (ActiveMQ)
        orderService.queueOrderStatusUpdate(id, status);

        if (status == OrderStatus.PAID) {
            orderService.queueOrderInvoice(id); // Számla generálás és küldés sorba
        }

        return ResponseEntity.ok("✅ Rendelés státusza frissítési és email/számla sorba helyezve: " + status);
    }

    @PostMapping("/{id}/queue-email")
    public ResponseEntity<String> queueOrderEmail(@PathVariable Long id) {
        orderService.queueOrderEmail(id);
        return ResponseEntity.ok("✅ Email küldési kérés sorba helyezve a rendeléshez: " + id);
    }

    @PostMapping("/{id}/queue-invoice")
    public ResponseEntity<String> queueOrderInvoice(@PathVariable Long id) {
        orderService.queueOrderInvoice(id);
        return ResponseEntity.ok("✅ Számla generálási kérés sorba helyezve a rendeléshez: " + id);
    }

}
