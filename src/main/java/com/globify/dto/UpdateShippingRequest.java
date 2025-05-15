package com.globify.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdateShippingRequest {
    @NotNull
    private BigDecimal price;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
