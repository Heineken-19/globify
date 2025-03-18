package com.globify.dto;

import com.globify.entity.Order;
import com.globify.entity.OrderBilling;
import com.globify.entity.OrderItem;
import com.globify.entity.OrderShipping;
import com.globify.entity.PaymentMethod;
import com.globify.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserOrderDTO {

    private Long id;
    private BigDecimal totalPrice;
    private BigDecimal finalPrice;
    private BigDecimal shippingCost;
    private BigDecimal discountAmount;
    private String status;
    private LocalDateTime createdAt;

    // ✅ Payment adatok
    private PaymentMethod paymentMethod;

    // ✅ Shipping adatok
    private String shippingAddress;
    private String shippingPoint;

    // ✅ OrderItem adatok
    private List<OrderItemDTO> items;

    // ✅ Billing adatok
    private BillingDataDTO billingData;

    public UserOrderDTO(Order order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.finalPrice = order.getFinalPrice();
        this.shippingCost = order.getShippingCost();
        this.discountAmount = order.getDiscountAmount();
        this.status = order.getStatus().toString();
        this.createdAt = order.getCreatedAt();

        // ✅ PaymentMethod kitöltése
        this.paymentMethod = order.getPaymentMethod();

        // ✅ Shipping adatok kitöltése
        OrderShipping shipping = order.getShipping();
        if (shipping != null) {
            this.shippingAddress = shipping.getShippingAddress();
            this.shippingPoint = shipping.getShippingPoint();
        }

        // ✅ OrderItem adatok kitöltése
        if (order.getOrderItems() != null) {
            this.items = order.getOrderItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        }

        // ✅ Billing adatok kitöltése
        OrderBilling billing = order.getBilling();
        if (billing != null) {
            this.billingData = new BillingDataDTO(billing);
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemDTO {
        private Long id;
        private BigDecimal price;
        private int quantity;

        // 🔥 Hozzáadott mezők a termékről
        private String productName;
        private List<String> imageUrls;
        private String size;
        private String type;

        public OrderItemDTO(OrderItem orderItem) {
            this.id = orderItem.getId();
            this.price = orderItem.getPrice();
            this.quantity = orderItem.getQuantity();

            // ✅ Product adatok kitöltése
            Product product = orderItem.getProduct();
            if (product != null) {
                this.productName = product.getName();
                this.size = product.getSize();
                this.type = product.getType();
                this.imageUrls = product.getImages()
                        .stream()
                        .map(image -> image.getImagePath())
                        .collect(Collectors.toList());
            }
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BillingDataDTO {
        private String city;
        private String companyName;
        private String country;
        private String postalCode;
        private String street;
        private String taxNumber;

        public BillingDataDTO(OrderBilling billing) {
            this.city = billing.getCity();
            this.companyName = billing.getCompanyName();
            this.country = billing.getCountry();
            this.postalCode = billing.getPostalCode();
            this.street = billing.getStreet();
            this.taxNumber = billing.getTaxNumber();
        }
    }
}
