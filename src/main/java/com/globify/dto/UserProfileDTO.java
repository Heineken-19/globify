package com.globify.dto;

import com.globify.entity.User;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserProfileDTO {
    private Long id;
    private String email;
    private boolean emailVerified;
    private String firstName;
    private String lastName;
    private String nickname;
    private String phone;
    private LocalDate birthDate;
    private LocalDateTime createdAt;
    private List<AddressDTO> addresses;
    private List<BillingDTO> billingDetails;
    private String avatar;

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.emailVerified = user.isEmailVerified();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.nickname = user.getNickname();
        this.phone = user.getPhone();
        this.birthDate = user.getBirthDate();
        this.createdAt = user.getCreatedAt();
        this.addresses = user.getAddresses().stream().map(AddressDTO::new).toList();
        this.billingDetails = user.getBillingDetails().stream().map(BillingDTO::new).toList();
        this.avatar = user.getAvatar();
    }

}
