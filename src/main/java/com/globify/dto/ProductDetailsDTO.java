package com.globify.dto;

import com.globify.entity.ProductDetails;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailsDTO {

    private String light;
    private String water;
    private String extra;
    private String fact;

    public ProductDetailsDTO(ProductDetails details) {
        this.light = details.getLight();
        this.water = details.getWater();
        this.extra = details.getExtra();
        this.fact = details.getFact();
    }
}
