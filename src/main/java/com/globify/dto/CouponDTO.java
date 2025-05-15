package com.globify.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponDTO {
    private Long id;
    private String code;
    private BigDecimal discountPercentage;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private boolean firstOrderOnly;

    // Csak minimális user infó
    private Long userId;
    private String userEmail;
}
