package com.globify.test.controller;

import com.globify.controller.AdminStatsController;
import com.globify.service.AdminStatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminStatsControllerTest {

    @Mock
    private AdminStatsService adminStatsService;

    @InjectMocks
    private AdminStatsController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetRegistrationsCount_DefaultDates() {
        when(adminStatsService.getRegistrationsCount(any(), any())).thenReturn(Collections.emptyList());

        ResponseEntity<List<Map<String, Object>>> response = controller.getRegistrationsCount(null, null);

        assertEquals(200, response.getStatusCodeValue());
        verify(adminStatsService).getRegistrationsCount(any(), any());
    }

    @Test
    void testGetDailyOrderStats() {
        LocalDate date = LocalDate.now();
        when(adminStatsService.getDailyOrderStats(date)).thenReturn(Collections.singletonMap("orders", 5));

        ResponseEntity<Map<String, Object>> response = controller.getDailyOrderStats(date);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(5, response.getBody().get("orders"));
    }

    @Test
    void testGetLoginsCount() {
        LocalDate date = LocalDate.now();
        when(adminStatsService.getLoginsCount(date)).thenReturn(Collections.singletonMap("logins", 10));

        ResponseEntity<Map<String, Object>> response = controller.getLoginsCount(date);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(10, response.getBody().get("logins"));
    }

    @Test
    void testGetWeeklyRevenueLast5() {
        when(adminStatsService.getWeeklyRevenueForLast5Weeks()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Map<String, Object>>> response = controller.getWeeklyRevenueLast5();

        assertEquals(200, response.getStatusCodeValue());
        verify(adminStatsService).getWeeklyRevenueForLast5Weeks();
    }

    @Test
    void testGetMonthlyRevenueLast5() {
        when(adminStatsService.getMonthlyRevenueForLast5Months()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Map<String, Object>>> response = controller.getMonthlyRevenueLast5();

        assertEquals(200, response.getStatusCodeValue());
        verify(adminStatsService).getMonthlyRevenueForLast5Months();
    }

    @Test
    void testGetTopProducts() {
        when(adminStatsService.getTopProducts(3)).thenReturn(Collections.emptyList());

        ResponseEntity<List<Map<String, Object>>> response = controller.getTopProducts(3);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testGetUserActivity() {
        when(adminStatsService.getUserActivity()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Map<String, Object>>> response = controller.getUserActivity();

        assertEquals(200, response.getStatusCodeValue());
    }
}
