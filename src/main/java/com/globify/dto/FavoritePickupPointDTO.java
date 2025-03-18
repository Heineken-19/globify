package com.globify.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FavoritePickupPointDTO {
    private Long id;
    private String placeId;
    private String name;
    private String city;
    private String zip;
    private String address;


}
