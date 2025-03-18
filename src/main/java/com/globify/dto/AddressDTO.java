package com.globify.dto;

import com.globify.entity.Address;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddressDTO {
    private String street;
    private String city;
    private String postalCode;

    public AddressDTO(Address address) {
        this.street = address.getStreet();
        this.city = address.getCity();
        this.postalCode = address.getPostalCode();
    }

    // GETTEREK, SETTEREK...
}
