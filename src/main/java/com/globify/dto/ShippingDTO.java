package com.globify.dto;

import com.globify.entity.OrderShipping;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDTO {

    private String address;
    private String shippingMethod;
    private String shippingPoint;

    public static ShippingDTO fromEntity(OrderShipping shipping) {
        if (shipping == null) {
            return null;
        }
        return new ShippingDTO(
                shipping.getShippingAddress(),
                shipping.getShippingMethod(),
                shipping.getShippingPoint()
        );
    }
}