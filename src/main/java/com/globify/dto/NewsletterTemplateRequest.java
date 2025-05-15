package com.globify.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewsletterTemplateRequest {
    private String subject;
    private String message;
    private List<String> imageUrls;
}
