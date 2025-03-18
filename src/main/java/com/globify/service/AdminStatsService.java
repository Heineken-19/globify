package com.globify.service;

import com.globify.repository.OrderItemRepository;
import com.globify.repository.OrderRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminStatsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminStatsService(UserRepository userRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // 🔹 1️⃣ Adott napi regisztrációk száma
    public List<Map<String, Object>> getRegistrationsCount(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> registrationStats = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            long count = userRepository.countByCreatedAtBetween(
                    date.atStartOfDay(), date.plusDays(1).atStartOfDay());

            Map<String, Object> dailyData = new HashMap<>();
            dailyData.put("date", date.toString());
            dailyData.put("registrations", count);
            registrationStats.add(dailyData);
        }

        return registrationStats;
    }

    // 🔹 1️⃣ Adott napi rendelés statisztika
    public Map<String, Object> getDailyOrderStats(LocalDate date) {
        long totalOrders = orderRepository.countByCreatedAtBetween(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        BigDecimal totalRevenue = orderRepository.sumTotalPriceByCreatedAtBetween(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        Map<String, Object> stats = new HashMap<>();
        stats.put("date", date.toString());
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        return stats;
    }

    // 🔹 4️⃣ Adott napi bejelentkezések száma
    public Map<String, Object> getLoginsCount(LocalDate date) {
        long count = userRepository.countByLastLoginBetween(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        return createResponse("date", date, "logins", count);
    }

    // 🔹 Helper metódus az egységes válaszhoz
    private Map<String, Object> createResponse(String key1, Object value1, String key2, Object value2) {
        Map<String, Object> response = new HashMap<>();
        response.put(key1, value1);
        response.put(key2, value2);
        return response;
    }

    // 🔹 Heti / havi bevétel statisztika
    public Map<String, Object> getRevenueStats(String period) {
        LocalDate startDate;
        if ("weekly".equalsIgnoreCase(period)) {
            startDate = LocalDate.now().minusWeeks(1);
        } else if ("monthly".equalsIgnoreCase(period)) {
            startDate = LocalDate.now().minusMonths(1);
        } else {
            throw new IllegalArgumentException("Érvénytelen időszak: weekly vagy monthly kell legyen.");
        }

        // 🔹 Pontos időszűrés az időintervallumra
        LocalDateTime startDateTime = startDate.atStartOfDay(); // 00:00:00
        LocalDateTime endDateTime = LocalDate.now().atTime(LocalTime.MAX); // 23:59:59

        BigDecimal totalRevenue = orderRepository.sumTotalPriceByCreatedAtBetween(startDateTime, endDateTime);

        Map<String, Object> stats = new HashMap<>();
        stats.put("period", period);
        stats.put("startDate", startDate.toString());
        stats.put("endDate", LocalDate.now().toString());
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        return stats;
    }

    // 🔹 Legtöbbet vásárolt termékek
    public List<Map<String, Object>> getTopProducts(int limit) {
        return orderItemRepository.findTopProducts(limit);
    }

    public List<Map<String, Object>> getUserActivity() {
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> activityData = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long loginCount = userRepository.countByLastLoginBetween(
                    date.atStartOfDay(), date.plusDays(1).atStartOfDay());

            Map<String, Object> data = new HashMap<>();
            data.put("date", date.toString());
            data.put("count", loginCount);
            activityData.add(data);
        }

        return activityData;
    }
}
