package com.globify.test.controller;

import com.globify.entity.Address;
import com.globify.entity.User;
import com.globify.repository.AddressRepository;
import com.globify.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AddressControllerTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private com.globify.controller.AddressController addressController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        when(userDetails.getUsername()).thenReturn("test@example.com");
    }

    @Test
    void testGetUserAddresses_UserExists_ReturnsAddresses() {
        Address address1 = new Address();
        Address address2 = new Address();
        List<Address> mockAddresses = Arrays.asList(address1, address2);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findByUserId(1L)).thenReturn(mockAddresses);

        ResponseEntity<List<Address>> response = addressController.getUserAddresses(userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetUserAddresses_UserNotFound_ReturnsNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        ResponseEntity<List<Address>> response = addressController.getUserAddresses(userDetails);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testGetDefaultAddress_UserExistsAndAddressFound() {
        Address defaultAddress = new Address();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findByUserIdAndIsDefaultTrue(1L)).thenReturn(Optional.of(defaultAddress));

        ResponseEntity<Address> response = addressController.getDefaultAddress(userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(defaultAddress, response.getBody());
    }

    @Test
    void testGetDefaultAddress_AddressNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findByUserIdAndIsDefaultTrue(1L)).thenReturn(Optional.empty());

        ResponseEntity<Address> response = addressController.getDefaultAddress(userDetails);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testAddAddress_DefaultSetToTrue_UpdatesOtherAddresses() {
        Address newAddress = new Address();
        newAddress.setIsDefault(true);
        newAddress.setAddressType(null);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.save(any(Address.class))).thenReturn(newAddress);

        ResponseEntity<Address> response = addressController.addAddress(userDetails, newAddress);

        verify(addressRepository).updateDefaultStatusForUser(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Otthoni", response.getBody().getAddressType());
    }

    @Test
    void testUpdateAddress_UserExists_AddressUpdated() {
        Long addressId = 1L;
        Address updatedAddress = new Address();
        updatedAddress.setIsDefault(true);
        updatedAddress.setAddressType("Munkahely");

        Address existingAddress = new Address();
        existingAddress.setUser(mockUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(existingAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(updatedAddress);

        ResponseEntity<Address> response = addressController.updateAddress(userDetails, 1L, updatedAddress);

        verify(addressRepository).updateDefaultStatusForUser(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Munkahely", response.getBody().getAddressType());
    }

    @Test
    void testUpdateAddress_NotFound_ReturnsNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Address> response = addressController.updateAddress(userDetails,1L,  new Address());

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteAddress_UserExists_DeletesSuccessfully() {
        mockUser.setId(1L);
        Address address = new Address();
        address.setUser(mockUser); // ugyanaz az objektum, nem új User()

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        ResponseEntity<?> response = addressController.deleteAddress(userDetails, 1L);

        verify(addressRepository).deleteById(1L);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteAddress_UnauthorizedUser_ReturnsForbidden() {
        User otherUser = new User();
        otherUser.setId(999L); // eltérő ID

        mockUser.setId(1L); // a tesztelt user

        Address address = new Address();
        address.setUser(otherUser); // eltérő user

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        ResponseEntity<?> response = addressController.deleteAddress(userDetails, 1L);

        assertEquals(403, response.getStatusCodeValue());
    }
}