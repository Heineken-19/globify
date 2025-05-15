package com.globify.test.controller;

import com.globify.controller.AdminOrderController;
import com.globify.dto.AdminOrderDTO;
import com.globify.entity.OrderStatus;
import com.globify.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminOrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private AdminOrderController adminOrderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllOrders_ReturnsOrderList() {
        AdminOrderDTO order1 = new AdminOrderDTO();
        AdminOrderDTO order2 = new AdminOrderDTO();
        List<AdminOrderDTO> orders = Arrays.asList(order1, order2);

        when(orderService.getAllOrders()).thenReturn(orders);

        ResponseEntity<List<AdminOrderDTO>> response = adminOrderController.getAllOrders();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testUpdateOrderStatus_ValidStatus_ReturnsOk() {
        Long orderId = 1L;
        Map<String, String> request = new HashMap<>();
        request.put("status", "SHIPPED");

        ResponseEntity<String> response = adminOrderController.updateOrderStatus(orderId, request);

        verify(orderService).updateOrderStatus(orderId, OrderStatus.SHIPPED);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Rendelés státusza frissítve: SHIPPED", response.getBody());
    }

    @Test
    void testUpdateOrderStatus_InvalidStatus_ReturnsBadRequest() {
        Long orderId = 1L;
        Map<String, String> request = new HashMap<>();
        request.put("status", "INVALID_STATUS");

        ResponseEntity<String> response = adminOrderController.updateOrderStatus(orderId, request);

        verify(orderService, never()).updateOrderStatus(anyLong(), any());
        assertEquals(400, response.getStatusCode().value());
        assertTrue(response.getBody().contains("Érvénytelen rendelési státusz"));
    }
}
