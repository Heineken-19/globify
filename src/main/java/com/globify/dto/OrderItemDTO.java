package com.globify.dto;

import com.globify.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private int quantity;

    public static OrderItemDTO fromEntity(OrderItem orderItem) {
        if (orderItem == null || orderItem.getProduct() == null) {
            return null;
        }
        return new OrderItemDTO(
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getPrice(),
                orderItem.getQuantity()
        );
    }
}
