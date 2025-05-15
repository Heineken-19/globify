package com.globify.dto;

import com.globify.entity.ShippingMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class GuestOrderRequestDTO {
    private String email;
    private BigDecimal totalPrice;
    private BigDecimal finalPrice;
    private BigDecimal discountAmount;
    private BigDecimal shippingCost;
    private String couponCode;
    private String discountName;
    private String paymentMethod;
    private ShippingMethod shippingMethod;
    private String shippingPoint;
    private String shippingAddress;
    private BillingDTO billingData;
    private List<OrderItemDTO> items;
}
