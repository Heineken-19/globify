package com.globify.service;

import com.globify.repository.OrderItemRepository;
import com.globify.repository.OrderRepository;
import com.globify.repository.SubscriberRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

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

    private final SubscriberRepository subscriberRepository;

    public AdminStatsService(UserRepository userRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, SubscriberRepository subscriberRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.subscriberRepository = subscriberRepository;
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

    public List<Map<String, Object>> getWeeklyRevenueForLast5Weeks() {
        List<Map<String, Object>> result = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (int i = 4; i >= 0; i--) {
            LocalDate monday = today.minusWeeks(i).with(java.time.DayOfWeek.MONDAY);
            LocalDate sunday = monday.plusDays(6);

            BigDecimal totalRevenue = orderRepository.sumTotalPriceByCreatedAtBetween(
                    monday.atStartOfDay(),
                    sunday.atTime(LocalTime.MAX)
            );

            Map<String, Object> weekData = new HashMap<>();
            weekData.put("startDate", monday.toString());
            weekData.put("endDate", sunday.toString());
            weekData.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

            result.add(weekData);
        }

        return result;
    }

    public List<Map<String, Object>> getMonthlyRevenueForLast5Months() {
        List<Map<String, Object>> result = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (int i = 4; i >= 0; i--) {
            LocalDate firstDayOfMonth = today.minusMonths(i).withDayOfMonth(1);
            LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(
                    Math.min(30, firstDayOfMonth.lengthOfMonth())
            );
            BigDecimal totalRevenue = orderRepository.sumTotalPriceByCreatedAtBetween(
                    firstDayOfMonth.atStartOfDay(),
                    lastDayOfMonth.atTime(LocalTime.MAX)
            );

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", firstDayOfMonth.getMonth().toString());
            monthData.put("startDate", firstDayOfMonth.toString());
            monthData.put("endDate", lastDayOfMonth.toString());
            monthData.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

            result.add(monthData);
        }

        return result;
    }

    // 🔹 Legtöbbet vásárolt termékek
    public List<Map<String, Object>> getTopProducts(int limit) {
        return orderItemRepository.findTopProducts(PageRequest.of(0, limit));
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

    public List<Map<String, Object>> getDailyNewsletterSubscriptions(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> stats = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            long count = subscriberRepository.countByCreatedAtBetween(
                    date.atStartOfDay(), date.plusDays(1).atStartOfDay());

            Map<String, Object> data = new HashMap<>();
            data.put("date", date.toString());
            data.put("subscriptions", count);
            stats.add(data);
        }

        return stats;
    }
}
