package com.globify.test.controller;

import com.globify.controller.FavoriteController;
import com.globify.dto.ProductDTO;
import com.globify.service.FavoriteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FavoriteControllerTest {

    @Mock
    private FavoriteService favoriteService;

    @InjectMocks
    private FavoriteController favoriteController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserFavorites() {
        Long userId = 1L;
        List<ProductDTO> mockFavorites = Arrays.asList(new ProductDTO(), new ProductDTO());

        when(favoriteService.getUserFavorites(userId)).thenReturn(mockFavorites);

        List<ProductDTO> result = favoriteController.getUserFavorites(userId);

        assertEquals(2, result.size());
    }

    @Test
    void testAddFavorite() {
        Long userId = 1L;
        Long productId = 10L;

        String response = favoriteController.addFavorite(userId, productId);

        verify(favoriteService).addFavorite(userId, productId);
        assertEquals("Termék hozzáadva a kedvencekhez!", response);
    }

    @Test
    void testRemoveFavorite() {
        Long userId = 1L;
        Long productId = 10L;

        String response = favoriteController.removeFavorite(userId, productId);

        verify(favoriteService).removeFavorite(userId, productId);
        assertEquals("Termék eltávolítva a kedvencek közül!", response);
    }
}
