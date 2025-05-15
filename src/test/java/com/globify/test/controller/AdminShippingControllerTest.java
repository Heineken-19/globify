package com.globify.test.controller;

import com.globify.controller.AdminShippingController;
import com.globify.dto.ShippingOptionDTO;
import com.globify.dto.UpdateShippingRequest;
import com.globify.entity.ShippingMethod;
import com.globify.entity.ShippingRate;
import com.globify.repository.ShippingRateRepository;
import com.globify.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminShippingControllerTest {

    @Mock
    private AdminService adminService;

    @Mock
    private ShippingRateRepository shippingRateRepository;

    @InjectMocks
    private AdminShippingController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllRates() {
        ShippingOptionDTO dto1 = new ShippingOptionDTO();
        ShippingOptionDTO dto2 = new ShippingOptionDTO();
        when(adminService.getAllShippingRates()).thenReturn(Arrays.asList(dto1, dto2));

        List<ShippingOptionDTO> result = controller.getAllRates();

        assertEquals(2, result.size());
        verify(adminService).getAllShippingRates();
    }

    @Test
    void testGetAllShippingRates() {
        ShippingRate rate1 = new ShippingRate();
        ShippingRate rate2 = new ShippingRate();
        when(shippingRateRepository.findAll()).thenReturn(Arrays.asList(rate1, rate2));

        List<ShippingRate> result = controller.getAllShippingRates();

        assertEquals(2, result.size());
        verify(shippingRateRepository).findAll();
    }

    @Test
    void testCreateRate_Success() {
        ShippingOptionDTO dto = new ShippingOptionDTO();
        dto.setMethod(ShippingMethod.HOME_DELIVERY);
        dto.setPrice(BigDecimal.valueOf(123.45));

        ResponseEntity<?> response = controller.createRate(dto);

        assertEquals(200, response.getStatusCodeValue());
        verify(shippingRateRepository).save(any(ShippingRate.class));
    }

    @Test
    void testCreateRate_BadRequest() {
        ShippingOptionDTO dto = new ShippingOptionDTO();

        ResponseEntity<?> response = controller.createRate(dto);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testUpdateRate() {
        ShippingOptionDTO dto = new ShippingOptionDTO();
        UpdateShippingRequest request = new UpdateShippingRequest();
        request.setPrice(BigDecimal.TEN);

        when(adminService.updateShippingRateById(eq(3L), eq(BigDecimal.TEN))).thenReturn(dto);

        ResponseEntity<ShippingOptionDTO> response = controller.updateRate(3L, request);
        ShippingOptionDTO result = response.getBody();

        assertEquals(dto, result);
        verify(adminService).updateShippingRateById(3L, BigDecimal.TEN);
    }

    @Test
    void testDeleteRate() {
        controller.deleteRate(2L);
        verify(adminService).deleteShippingRateById(2L);
    }
}
