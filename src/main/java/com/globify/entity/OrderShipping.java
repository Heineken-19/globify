package com.globify.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_shipping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderShipping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String shippingMethod;
    private String shippingPoint;
    private String shippingAddress;
}