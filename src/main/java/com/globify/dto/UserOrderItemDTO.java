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
public class UserOrderItemDTO {
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;

    // 🔥 Konstruktor OrderItem alapján
    public UserOrderItemDTO(OrderItem orderItem) {
        this.productId = orderItem.getProduct().getId();
        this.productName = orderItem.getProduct().getName();
        this.quantity = orderItem.getQuantity();
        this.price = orderItem.getPrice();
    }
}
