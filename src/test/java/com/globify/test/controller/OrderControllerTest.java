package com.globify.test.controller;

import com.globify.controller.OrderController;
import com.globify.dto.OrderDTO;
import com.globify.dto.OrderRequestDTO;
import com.globify.dto.UserOrderDTO;
import com.globify.entity.User;
import com.globify.repository.UserRepository;
import com.globify.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private OrderController orderController;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        when(userDetails.getUsername()).thenReturn("test@example.com");
    }

    @Test
    void testPlaceOrder_Success() {
        OrderRequestDTO requestDTO = new OrderRequestDTO();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(orderService.createOrder(eq("test@example.com"), eq(requestDTO))).thenReturn(123L);

        ResponseEntity<?> response = orderController.placeOrder(userDetails, requestDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(123L, ((Map<?, ?>) response.getBody()).get("id"));
    }

    @Test
    void testPlaceOrder_Unauthorized() {
        ResponseEntity<?> response = orderController.placeOrder(null, new OrderRequestDTO());
        assertEquals(401, response.getStatusCodeValue());
        assertEquals("User is not authenticated", response.getBody());
    }

    @Test
    void testGetUserOrders() {
        Page<UserOrderDTO> page = new PageImpl<>(List.of(new UserOrderDTO()));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(orderService.getUserOrders(user, 0, 20)).thenReturn(page);

        ResponseEntity<Page<UserOrderDTO>> response = orderController.getUserOrders(userDetails, 0, 20);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().getContent().size());
    }

    @Test
    void testGetUserOrders_Empty() {
        Page<UserOrderDTO> emptyPage = Page.empty();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(orderService.getUserOrders(user, 0, 20)).thenReturn(emptyPage);

        ResponseEntity<Page<UserOrderDTO>> response = orderController.getUserOrders(userDetails, 0, 20);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testGetOrderById() {
        OrderDTO dto = new OrderDTO();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(orderService.getOrderById(1L, user)).thenReturn(dto);

        ResponseEntity<OrderDTO> response = orderController.getOrderById(1L, userDetails);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void testCancelOrder() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<String> response = orderController.cancelOrder(userDetails, 1L);

        verify(orderService).cancelOrder(1L, user);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Rendelés törölve!", response.getBody());
    }
}
