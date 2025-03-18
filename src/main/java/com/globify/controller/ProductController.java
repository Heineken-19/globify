package com.globify.controller;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globify.dto.ProductDTO;
import com.globify.entity.Category;
import com.globify.entity.Product;
import com.globify.repository.CategoryRepository;
import com.globify.service.FileStorageService;
import com.globify.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final CategoryRepository categoryRepository;
    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProductController(ProductService productService, FileStorageService fileStorageService, CategoryRepository categoryRepository) {
        this.productService = productService;
        this.fileStorageService = fileStorageService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm) {

        Long categoryId = null;

        // Kategória név alapján keresés
        if (category != null) {
            categoryId = categoryRepository.findByName(category)
                    .map(Category::getId)
                    .orElse(null);
        }

        List<ProductDTO> products = productService.getAllProducts(categoryId, searchTerm);
        return ResponseEntity.ok(products);
    }

    // 🔹 Egyedi termék lekérdezése (Redis cache támogatással)
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO productDTO = productService.getProductById(id);
        return ResponseEntity.ok(productDTO);
    }

    // 🔹 Ajánlott termékek lekérdezése (Redis cache támogatással)
    @GetMapping("/{productId}/recommendations")
    public List<Product> getRecommendedProducts(@PathVariable Long productId) {
        return productService.getRecommendedProducts(productId);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam("product") String productJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "light", required = false) String light,
            @RequestParam(value = "water", required = false) String water,
            @RequestParam(value = "extra", required = false) String extra,
            @RequestParam(value = "fact", required = false) String fact) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(productJson, Product.class);

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Kategória nem található!"));
            product.setCategory(category);
        }


        ProductDTO savedProduct = productService.createProduct(product, files, light, water, extra, fact);

        return ResponseEntity.ok(savedProduct);
    }



    // 🔹 Termék frissítése (cache frissítés)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "light", required = false) String light,
            @RequestParam(value = "water", required = false) String water,
            @RequestParam(value = "extra", required = false) String extra,
            @RequestParam(value = "fact", required = false) String fact) throws IOException {

        // JSON deszerializálása Product objektummá
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Product updatedProduct = objectMapper.readValue(productJson, Product.class);

        // Ha az `available` null, akkor állítsuk be true-ra
        updatedProduct.setAvailable(Boolean.TRUE.equals(updatedProduct.getAvailable()));

        // Termék frissítése a service-ben
        Product updated = productService.updateProduct(id, updatedProduct, files, light, water, extra, fact);

        return ResponseEntity.ok(new ProductDTO(updated));
    }

    // 🔹 Termék törlése (cache frissítés)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
