package com.globify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogPostRequestDTO {
    @NotBlank(message = "Title cannot be null or empty")
    private String title;

    private String slug;
    private String description;
    private String content;
    private String imageUrl;
    private String blogCategory;
    private Boolean highlighted;
    private String author;
}