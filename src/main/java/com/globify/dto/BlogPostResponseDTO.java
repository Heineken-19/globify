package com.globify.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class BlogPostResponseDTO {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String content;
    private String imageUrl;
    private String blogCategory;
    private Boolean highlighted;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}