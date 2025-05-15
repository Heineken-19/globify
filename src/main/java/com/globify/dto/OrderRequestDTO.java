package com.globify.dto;

import com.globify.entity.PaymentMethod;
import com.globify.entity.ShippingMethod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    private Long userId;
    private BigDecimal totalPrice;
    private BigDecimal finalPrice;
    private String status;
    private PaymentMethod paymentMethod;
    private ShippingMethod shippingMethod;
    private String shippingPoint;
    private String shippingAddress;
    private BigDecimal shippingCost;
    private boolean firstOrder;
    private BigDecimal discountAmount;
    private String couponCode;
    private String discountName;
    private BillingDTO billingData;
    private List<OrderItemDTO> items;
    private int usedRewardPoints;
}
