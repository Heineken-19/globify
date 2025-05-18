package com.globify.dto;

import com.globify.entity.Category;
import com.globify.entity.Product;
import com.globify.entity.ProductImage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String title;
    private String description;
    private BigDecimal price;
    private List<String> imageUrls;
    private Integer stock;
    private Boolean available;
    private String size;
    private String type;
    private CategoryDTO category;
    private Boolean isNew;
    private Boolean isSale;
    private BigDecimal discountPercentage;
    private Double mainSize;
    private String slug;


    private String light;
    private String water;
    private String extra;
    private String fact;

    // ✅ Konstruktor a Product entitás alapján
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.title = product.getTitle();
        this.description = product.getDescription();
        this.stock = product.getStock();
        this.price = product.getPrice();
        this.imageUrls = product.getImages() != null ?
                product.getImages().stream()
                        .map(ProductImage::getImagePath)
                        .collect(Collectors.toList()) : null;
        this.available = product.getAvailable();
        this.size = product.getSize();
        this.type = product.getType();
        this.category = product.getCategory() != null ? new CategoryDTO(product.getCategory()) : null;
        this.isNew = product.getIsNew();
        this.isSale = product.getIsSale();
        this.discountPercentage = product.getDiscountPercentage();
        this.mainSize = product.getMainSize();
        this.slug = product.getSlug();

        // ✅ ProductDetails beállítása
        if (product.getProductDetails() != null) {
            this.light = product.getProductDetails().getLight();
            this.water = product.getProductDetails().getWater();
            this.extra = product.getProductDetails().getExtra();
            this.fact = product.getProductDetails().getFact();
        }
    }
}
