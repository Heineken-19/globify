package com.globify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
