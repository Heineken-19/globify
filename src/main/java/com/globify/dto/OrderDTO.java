package com.globify.dto;

import com.globify.entity.Order;
import com.globify.entity.OrderItem;
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
public class OrderDTO {
    private Long id;
    private BigDecimal totalPrice;
    private BigDecimal finalPrice;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.finalPrice = order.getFinalPrice();
        this.status = order.getStatus().toString();
        this.createdAt = order.getCreatedAt();

        // ✅ Töltsük fel az OrderItem adatait
        this.items = order.getOrderItems().stream()
                .map(OrderItemDTO::new)
                .collect(Collectors.toList());
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemDTO {
        private BigDecimal price;
        private int quantity;
        private ProductDTO product;
        private String size;
        private String type;


        public OrderItemDTO(OrderItem orderItem) {
            this.price = orderItem.getPrice();
            this.quantity = orderItem.getQuantity();
            this.product = new ProductDTO(orderItem.getProduct());
            this.size = orderItem.getProduct().getSize();
            this.type = orderItem.getProduct().getType();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductDTO {
        private Long id;
        private String name;
        private BigDecimal price;
        private List<String> imageUrls;

        public ProductDTO(Product product) {
            this.id = product.getId();
            this.name = product.getName();
            this.price = product.getPrice();
            this.imageUrls = product.getImages().stream()
                    .map(image -> image.getImagePath()) // ✅ Termék képek hozzáadása
                    .collect(Collectors.toList());
        }
    }
}
