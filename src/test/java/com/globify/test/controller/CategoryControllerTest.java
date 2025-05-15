package com.globify.test.controller;

import com.globify.controller.CategoryController;
import com.globify.entity.Category;
import com.globify.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryControllerTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryController categoryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCategories() {
        List<Category> categories = Arrays.asList(new Category(), new Category());
        when(categoryRepository.findAll()).thenReturn(categories);

        ResponseEntity<List<Category>> response = categoryController.getAllCategories();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetCategoryById_Found() {
        Category category = new Category();
        category.setId(1L);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        ResponseEntity<Category> response = categoryController.getCategoryById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testGetCategoryById_NotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.getCategoryById(1L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testCreateCategory_Success() {
        Category category = new Category();
        category.setName("Electronics");

        when(categoryRepository.findByName("Electronics")).thenReturn(Optional.empty());
        when(categoryRepository.save(category)).thenReturn(category);

        ResponseEntity<?> response = categoryController.createCategory(category);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testCreateCategory_AlreadyExists() {
        Category category = new Category();
        category.setName("Electronics");

        when(categoryRepository.findByName("Electronics")).thenReturn(Optional.of(category));

        ResponseEntity<?> response = categoryController.createCategory(category);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Category already exists", response.getBody());
    }

    @Test
    void testUpdateCategory_Found() {
        Category existing = new Category();
        existing.setId(1L);
        existing.setName("Old");

        Category updated = new Category();
        updated.setName("New");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(categoryRepository.save(existing)).thenReturn(existing);

        ResponseEntity<Category> response = categoryController.updateCategory(1L, updated);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New", response.getBody().getName());
    }

    @Test
    void testUpdateCategory_NotFound() {
        Category updated = new Category();
        updated.setName("New");

        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.updateCategory(1L, updated);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteCategory_Found() {
        when(categoryRepository.existsById(1L)).thenReturn(true);

        ResponseEntity<?> response = categoryController.deleteCategory(1L);

        verify(categoryRepository).deleteById(1L);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteCategory_NotFound() {
        when(categoryRepository.existsById(1L)).thenReturn(false);

        ResponseEntity<?> response = categoryController.deleteCategory(1L);

        assertEquals(404, response.getStatusCodeValue());
    }
}
