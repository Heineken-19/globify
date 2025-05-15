package com.globify.test.controller;

import com.globify.controller.AdminController;
import com.globify.dto.AdminUserDTO;
import com.globify.entity.Role;
import com.globify.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers_ReturnsUserList() {
        AdminUserDTO user1 = new AdminUserDTO();
        AdminUserDTO user2 = new AdminUserDTO();
        List<AdminUserDTO> mockUsers = Arrays.asList(user1, user2);

        when(adminService.getAllUsers()).thenReturn(mockUsers);

        ResponseEntity<List<AdminUserDTO>> response = adminController.getAllUsers();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testDeleteUser_CallsServiceAndReturnsOk() {
        Long userId = 1L;

        doNothing().when(adminService).deleteUser(userId);

        ResponseEntity<String> response = adminController.deleteUser(userId);

        verify(adminService).deleteUser(userId);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Felhasználó törölve!", response.getBody());
    }

    @Test
    void testUpdateUserRole_CallsServiceAndReturnsOk() {
        Long userId = 2L;
        String role = "ADMIN";

        doNothing().when(adminService).updateUserRole(userId, Role.ADMIN);

        ResponseEntity<String> response = adminController.updateUserRole(userId, role);

        verify(adminService).updateUserRole(userId, Role.ADMIN);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Felhasználói szerepkör módosítva: ADMIN", response.getBody());
    }
}
