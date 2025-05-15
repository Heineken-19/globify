package com.globify.test.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globify.controller.ProductController;
import com.globify.dto.ProductDTO;
import com.globify.entity.Category;
import com.globify.entity.Product;
import com.globify.repository.CategoryRepository;
import com.globify.service.FileStorageService;
import com.globify.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductControllerTest {

    private ProductController controller;
    private ProductService productService;
    private FileStorageService fileStorageService;
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        productService = mock(ProductService.class);
        fileStorageService = mock(FileStorageService.class);
        categoryRepository = mock(CategoryRepository.class);
        controller = new ProductController(productService, fileStorageService, categoryRepository);
    }

    @Test
    void testGetAllProducts() {
        Page<ProductDTO> page = new PageImpl<>(List.of(new ProductDTO()));
        when(productService.getAllProducts(any(), any(), anyInt(), anyInt(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(page);

        ResponseEntity<Page<ProductDTO>> response = controller.getAllProducts(
                null, null, 0, 12, null, null, null, null, null, null, null, null, null, null, null // ⬅️ 15 paraméter
        );
        assertEquals(200, response.getStatusCodeValue());
        assertFalse(response.getBody().isEmpty());
    }

    @Test
    void testGetProductById() {
        ProductDTO dto = new ProductDTO();
        when(productService.getProductById(1L)).thenReturn(dto);

        ResponseEntity<ProductDTO> response = controller.getProductById(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void testGetRecommendedProducts() {
        List<Product> recommended = List.of(new Product(), new Product());
        when(productService.getRecommendedProducts(1L)).thenReturn(recommended);

        List<Product> result = controller.getRecommendedProducts(1L);
        assertEquals(2, result.size());
    }

    @Test
    void testCreateProduct_CategoryFound() throws IOException {
        Product product = new Product();
        Category category = new Category();
        category.setId(1L);
        product.setCategory(category);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productService.createProduct(any(), any(), any(), any(), any(), any())).thenReturn(new ProductDTO());

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(product);

        ResponseEntity<ProductDTO> response = controller.createProduct(json, null, null, null, null, null);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testCreateProduct_CategoryNotFound() throws IOException {
        Product product = new Product();
        Category category = new Category();
        category.setId(99L);
        product.setCategory(category);

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(product);

        assertThrows(RuntimeException.class, () -> controller.createProduct(json, null, null, null, null, null));
    }

    @Test
    void testUpdateProduct() throws IOException {
        Product updated = new Product();
        when(productService.updateProduct(anyLong(), any(), any(), any(), any(), any(), any())).thenReturn(updated);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(updated);

        ResponseEntity<ProductDTO> response = controller.updateProduct(1L, json, null, null, null, null, null);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteProduct() {
        ResponseEntity<Void> response = controller.deleteProduct(1L);
        verify(productService).deleteProduct(1L);
        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void testGetNewProducts() {
        List<ProductDTO> newProducts = List.of(new ProductDTO());
        when(productService.getNewProducts()).thenReturn(newProducts);

        ResponseEntity<List<ProductDTO>> response = controller.getNewProducts();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(newProducts, response.getBody());
    }

    @Test
    void testGetSaleProducts() {
        List<ProductDTO> saleProducts = List.of(new ProductDTO());
        when(productService.getNewProducts()).thenReturn(saleProducts);

        ResponseEntity<List<ProductDTO>> response = controller.getSaleProducts();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(saleProducts, response.getBody());
    }
}