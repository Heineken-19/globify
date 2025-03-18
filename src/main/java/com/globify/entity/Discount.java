package com.globify.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Pl. "BLACKFRIDAY"

    @Column(nullable = false)
    private BigDecimal discountPercentage; // Pl. 20% kedvezmény

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
}
