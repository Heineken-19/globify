package com.globify.dto;

import com.globify.entity.OrderItem;
import com.globify.entity.Product;
import com.globify.entity.ProductImage;
import com.globify.entity.ProductDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String title;
    private String description;
    private double price;
    private List<String> imageUrls;
    private Integer stock;
    private Boolean available;
    private String size;
    private String type;
    private String category;
    private Boolean isNew;
    private Boolean isSale;
    private BigDecimal discountPercentage;
    private Double mainSize;
    private String slug;

    // Új mezők a ProductDetails miatt
    private String light;
    private String water;
    private String extra;
    private String fact;

    public ProductDTO(Long id, String name, String title, String description, Integer stock,
                      BigDecimal price, List<String> imageUrls, Boolean available,
                      String size, String type, String category, String light, String water,
                      String extra, String fact) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.stock = stock;
        this.price = convertBigDecimalToDouble(price);
        this.imageUrls = imageUrls;
        this.available = available;
        this.size = size;
        this.type = type;
        this.category = category;
        this.light = light;
        this.water = water;
        this.extra = extra;
        this.fact = fact;
    }

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.title = product.getTitle();
        this.description = product.getDescription();
        this.stock = product.getStock();
        this.price = convertBigDecimalToDouble(product.getPrice());
        this.imageUrls = product.getImages().stream()
                .map(ProductImage::getImagePath)
                .collect(Collectors.toList());
        this.available = product.getAvailable();
        this.size = product.getSize();
        this.type = product.getType();
        this.category = product.getCategory() != null ? product.getCategory().getName() : null;
        this.isNew = product.getIsNew();
        this.isSale = product.getIsSale();
        this.discountPercentage = product.getDiscountPercentage();
        this.mainSize = product.getMainSize();
        this.slug = product.getSlug();
        if (product.getProductDetails() != null) {
            this.light = product.getProductDetails().getLight();
            this.water = product.getProductDetails().getWater();
            this.extra = product.getProductDetails().getExtra();
            this.fact = product.getProductDetails().getFact();
        }
    }

    private double convertBigDecimalToDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : 0.0;
    }

}