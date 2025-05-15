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
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isSale,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) List<String> light,
            @RequestParam(required = false) List<String> water,
            @RequestParam(required = false) List<String> type,
            @RequestParam(required = false) Integer minMainSize,
            @RequestParam(required = false) Integer maxMainSize,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean isPopular

    ) {

        Page<ProductDTO> products = productService.getAllProducts(
                category, searchTerm, page, size, isNew, isSale, available,
                light, water, type, minMainSize, maxMainSize, minPrice, maxPrice, isPopular
        );
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

    @GetMapping("/new")
    public ResponseEntity<List<ProductDTO>> getNewProducts() {
        List<ProductDTO> newProducts = productService.getNewProducts();
        return ResponseEntity.ok(newProducts);
    }

    @GetMapping("/sale")
    public ResponseEntity<List<ProductDTO>> getSaleProducts() {
        List<ProductDTO> newProducts = productService.getNewProducts();
        return ResponseEntity.ok(newProducts);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDTO> getProductBySlug(@PathVariable String slug) {
        ProductDTO product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }
}
