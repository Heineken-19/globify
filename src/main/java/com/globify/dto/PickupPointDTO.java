package com.globify.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor  // Ezt add hozzá! 🔹
@AllArgsConstructor
public class PickupPointDTO {
    @JsonProperty("place_id")
    private String placeId;
    private String name;
    private String city;
    private String zip;
    private String address;
}
