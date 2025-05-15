package com.globify.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true, nullable = false)
    private String code; // Kuponkód pl. "WELCOME10"

    @Column(nullable = false)
    private BigDecimal discountPercentage; // Pl. 10% kedvezmény

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    @Column(nullable = false)
    private boolean firstOrderOnly; // Igaz, ha csak első rendeléshez használható
}
