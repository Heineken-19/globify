package com.globify.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globify.dto.ProductDTO;
import com.globify.entity.Product;
import com.globify.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllAvailableProducts(
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isSale,
            @RequestParam(required = false) List<String> light,
            @RequestParam(required = false) List<String> water,
            @RequestParam(required = false) List<String> type,
            @RequestParam(required = false) Double minMainSize,
            @RequestParam(required = false) Double maxMainSize,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {

        Page<ProductDTO> products = productService.getAllAvailableProducts(
                category, searchTerm, isNew, isSale,
                light, water, type,
                minMainSize, maxMainSize, minPrice, maxPrice,
                pageable);
        return ResponseEntity.ok(products);
    }

    // 🔹 Admin oldal - Minden termék (Elérhető és nem elérhető is)
    @GetMapping("/admin")
    public ResponseEntity<Page<ProductDTO>> getAllProductsForAdmin(
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isSale,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) List<String> light,
            @RequestParam(required = false) List<String> water,
            @RequestParam(required = false) List<String> type,
            @RequestParam(required = false) Double minMainSize,
            @RequestParam(required = false) Double maxMainSize,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {

        Page<ProductDTO> products = productService.getAllProductsForAdmin(
                category, searchTerm, isNew, isSale, available,
                light, water, type,
                minMainSize, maxMainSize, minPrice, maxPrice,
                pageable);
        return ResponseEntity.ok(products);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "light", required = false) String light,
            @RequestParam(value = "water", required = false) String water,
            @RequestParam(value = "extra", required = false) String extra,
            @RequestParam(value = "fact", required = false) String fact,
            @RequestParam(value = "discountPercentage", required = false) BigDecimal discountPercentage) throws IOException {

        ProductDTO productDTO = new ObjectMapper().readValue(productJson, ProductDTO.class);
        // ✅ Kedvezmény csak akkor kerül beállításra, ha isSale = true
        if (Boolean.TRUE.equals(productDTO.getIsSale())) {
            productDTO.setDiscountPercentage(discountPercentage);
        } else {
            productDTO.setDiscountPercentage(null);
        }

        return ResponseEntity.ok(productService.saveOrUpdateProduct(null, productDTO, files, light, water, extra, fact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "light", required = false) String light,
            @RequestParam(value = "water", required = false) String water,
            @RequestParam(value = "extra", required = false) String extra,
            @RequestParam(value = "fact", required = false) String fact,
            @RequestParam(value = "discountPercentage", required = false) BigDecimal discountPercentage) throws IOException {

        ProductDTO productDTO = new ObjectMapper().readValue(productJson, ProductDTO.class);
        // ✅ Kedvezmény csak akkor kerül beállításra, ha isSale = true
        if (Boolean.TRUE.equals(productDTO.getIsSale())) {
            productDTO.setDiscountPercentage(discountPercentage);
        } else {
            productDTO.setDiscountPercentage(null);
        }

        return ResponseEntity.ok(productService.saveOrUpdateProduct(id, productDTO, files, light, water, extra, fact));
    }

    // 🔹 Termék törlése (cache frissítés)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/new")
    public ResponseEntity<List<ProductDTO>> getNewProducts() {
        List<ProductDTO> newProducts = productService.getNewProducts();
        return ResponseEntity.ok(newProducts);
    }

    @GetMapping("/sale")
    public ResponseEntity<List<ProductDTO>> getSaleProducts() {
        List<ProductDTO> saleProducts = productService.getSaleProducts();
        return ResponseEntity.ok(saleProducts);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDTO> getProductBySlug(@PathVariable String slug) {
        ProductDTO product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }
}
