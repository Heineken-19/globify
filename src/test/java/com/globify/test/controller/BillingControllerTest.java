package com.globify.test.controller;

import com.globify.controller.BillingController;
import com.globify.entity.Billing;
import com.globify.entity.User;
import com.globify.repository.BillingRepository;
import com.globify.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BillingControllerTest {

    @Mock private BillingRepository billingRepository;
    @Mock private UserRepository userRepository;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private BillingController billingController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        when(userDetails.getUsername()).thenReturn("test@example.com");
    }

    @Test
    void testGetUserBilling_Success() {
        Billing billing1 = new Billing();
        Billing billing2 = new Billing();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.findByUserId(1L)).thenReturn(Arrays.asList(billing1, billing2));

        ResponseEntity<List<Billing>> response = billingController.getUserBilling(userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetUserBilling_UserNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        ResponseEntity<List<Billing>> response = billingController.getUserBilling(userDetails);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testAddBilling_Success() {
        Billing newBilling = new Billing();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.save(any(Billing.class))).thenReturn(newBilling);

        ResponseEntity<Billing> response = billingController.addBilling(userDetails, newBilling);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testAddBilling_UserNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        ResponseEntity<Billing> response = billingController.addBilling(userDetails, new Billing());

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testUpdateBilling_Success() {
        Billing updated = new Billing();
        updated.setCity("City");

        Billing existing = new Billing();
        existing.setUser(mockUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(billingRepository.save(any(Billing.class))).thenReturn(existing);

        ResponseEntity<Billing> response = billingController.updateBilling(userDetails, 1L, updated);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testUpdateBilling_NotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Billing> response = billingController.updateBilling(userDetails, 1L, new Billing());

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteBilling_Success() {
        Billing billing = new Billing();
        billing.setUser(mockUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.findById(1L)).thenReturn(Optional.of(billing));

        ResponseEntity<?> response = billingController.deleteBilling(userDetails, 1L);

        verify(billingRepository).deleteById(1L);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteBilling_NotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(billingRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = billingController.deleteBilling(userDetails, 1L);

        assertEquals(404, response.getStatusCodeValue());
    }
}