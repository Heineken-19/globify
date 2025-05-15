package com.globify.dto;

import com.globify.entity.ShippingMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ShippingOptionDTO {

    private Long id;

    @NotNull(message = "Method cannot be null")
    private ShippingMethod method;

    @NotNull(message = "Price cannot be null")
    private BigDecimal price;

    public ShippingOptionDTO() {
    }

    public ShippingOptionDTO(Long id, ShippingMethod method, BigDecimal price) {
        this.id = id;
        this.method = method;
        this.price = price;
    }
}
