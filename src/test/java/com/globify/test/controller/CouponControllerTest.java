package com.globify.test.controller;

import com.globify.controller.CouponController;
import com.globify.entity.Coupon;
import com.globify.entity.User;
import com.globify.dto.CouponDTO;
import com.globify.repository.UserRepository;
import com.globify.security.CustomUserDetails;
import com.globify.service.CouponService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CouponControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CouponService couponService;

    @InjectMocks
    private CouponController couponController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCoupons() {
        CouponDTO dto = new CouponDTO();
        when(couponService.getAllCoupons()).thenReturn(List.of(dto));

        ResponseEntity<List<CouponDTO>> response = couponController.getAllCoupons();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetCoupon_Found() {
        Coupon coupon = new Coupon();
        when(couponService.getCouponByCode("SAVE10")).thenReturn(Optional.of(coupon));

        ResponseEntity<Coupon> response = couponController.getCoupon("SAVE10");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(coupon, response.getBody());
    }

    @Test
    void testGetCoupon_NotFound() {
        when(couponService.getCouponByCode("INVALID")).thenReturn(Optional.empty());

        ResponseEntity<Coupon> response = couponController.getCoupon("INVALID");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testCreateCoupon() {
        Coupon coupon = new Coupon();
        when(couponService.createCoupon(any(Coupon.class))).thenReturn(coupon);

        ResponseEntity<Coupon> response = couponController.createCoupon(coupon);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(coupon, response.getBody());
    }

    @Test
    void testDeleteCoupon() {
        doNothing().when(couponService).deleteCoupon(1L);

        ResponseEntity<Void> response = couponController.deleteCoupon(1L);

        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void testApplyCoupon_Valid() {
        User mockUser = new User();
        mockUser.setRewardPoints(3000);

        CustomUserDetails mockDetails = mock(CustomUserDetails.class);
        when(mockDetails.getUser()).thenReturn(mockUser);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(couponService.applyCoupon("SAVE10", true, mockUser)).thenReturn(new BigDecimal("10.00"));

        ResponseEntity<BigDecimal> response = couponController.applyCoupon("SAVE10", true, mockDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(new BigDecimal("10.00"), response.getBody());
    }

    @Test
    void testApplyCoupon_Invalid() {
        User mockUser = new User();

        CustomUserDetails mockDetails = mock(CustomUserDetails.class);
        when(mockDetails.getUser()).thenReturn(mockUser);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(couponService.applyCoupon("INVALID", false, mockUser)).thenThrow(new IllegalArgumentException());

        ResponseEntity<BigDecimal> response = couponController.applyCoupon("INVALID", false, mockDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals(BigDecimal.ZERO, response.getBody());
    }
}
