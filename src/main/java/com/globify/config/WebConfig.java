package com.globify.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${product.upload-dir}")
    private String productUploadDir;

    @Value("${newsletter.upload-dir}")
    private String newsletterUploadDir;

    @Value("${blog.upload-dir}")
    private String blogUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 🛒 Termék képek
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:" + productUploadDir + "/")
                .setCachePeriod(3600);

        // 📨 Hírlevél képek
        registry.addResourceHandler("/uploads/newsletter/**")
                .addResourceLocations("file:" + newsletterUploadDir + "/")
                .setCachePeriod(3600);

    // 📚 Blog képek
        registry.addResourceHandler("/uploads/blog/**")
                .addResourceLocations("file:" + blogUploadDir + "/")
                .setCachePeriod(3600);
    }
}
