package com.globify.dto;

import com.globify.entity.Order;
import com.globify.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderDTO {

    private Long id;
    private String userEmail;
    private BigDecimal finalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> orderItems;
    private BillingDTO billingInfo;
    private ShippingDTO shippingInfo;

    public static AdminOrderDTO fromEntity(Order order) {
        String email = order.getUser() != null
                ? order.getUser().getEmail()
                : order.getGuestEmail(); // ✅ vendég email

        return new AdminOrderDTO(
                order.getId(),
                email,
                order.getFinalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getOrderItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .toList(),
                BillingDTO.fromEntity(order.getBilling()),
                ShippingDTO.fromEntity(order.getShipping())
        );
    }
}