package com.globify.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.globify.entity.Billing;
import com.globify.entity.OrderBilling;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BillingDTO {

    @JsonCreator
    public BillingDTO(
            @JsonProperty("companyName") String companyName,
            @JsonProperty("taxNumber") String taxNumber,
            @JsonProperty("street") String street,
            @JsonProperty("city") String city,
            @JsonProperty("postalCode") String postalCode,
            @JsonProperty("country") String country
    ) {
        this.companyName = companyName;
        this.taxNumber = taxNumber;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
    }

    public BillingDTO(Billing billing) {
        this.companyName = billing.getCompanyName();
        this.taxNumber = billing.getTaxNumber();
        this.street = billing.getStreet();
        this.city = billing.getCity();
        this.postalCode = billing.getPostalCode();
        this.country = billing.getCountry();
    }

    private String companyName;
    private String taxNumber;
    private String street;
    private String city;
    private String postalCode;
    private String country;
    private String billingType;

    public static BillingDTO fromEntity(OrderBilling billing) {
        if (billing == null) {
            return null;
        }
        return new BillingDTO(
                billing.getCompanyName(),
                billing.getTaxNumber(),
                billing.getStreet(),
                billing.getCity(),
                billing.getPostalCode(),
                billing.getCountry()
        );
    }

}
