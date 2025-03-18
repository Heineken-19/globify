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
    private BigDecimal total;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> orderItems;
    private BillingDTO billingInfo;
    private ShippingDTO shippingInfo;

    public static AdminOrderDTO fromEntity(Order order) {
        return new AdminOrderDTO(
                order.getId(),
                order.getUser().getEmail(),
                order.getTotalPrice(),
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