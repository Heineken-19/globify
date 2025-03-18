package com.globify.controller;

import com.globify.entity.Product;
import com.globify.entity.ProductImage;
import com.globify.repository.ProductImageRepository;
import com.globify.repository.ProductRepository;
import com.globify.service.FileStorageService;
import com.globify.service.ProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;
    private final ProductImageService productImageService;

    public ProductImageController(ProductImageRepository productImageRepository, ProductRepository productRepository, FileStorageService fileStorageService, ProductImageService productImageService) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
        this.productImageService = productImageService;
    }

    // Képfeltöltés egy termékhez
    @PostMapping("/{productId}/upload")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long productId, @RequestParam("files") List<MultipartFile> files) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        try {
            for (MultipartFile file : files) {
                String fileName = fileStorageService.saveFile(file);
                ProductImage productImage = new ProductImage();
                productImage.setProduct(product.get());
                productImage.setImagePath(fileName);
                productImageRepository.save(productImage);
            }
            return ResponseEntity.ok("Images uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File upload failed");
        }
    }

    // 🔹 Termék képeinek lekérdezése (Redis cache támogatással)
    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductImage>> getProductImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageService.getProductImages(productId);
        return ResponseEntity.ok(images);
    }

    // 🔹 Kép törlése (és cache frissítése)
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        Optional<ProductImage> image = productImageRepository.findById(imageId);
        if (image.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productImageService.deleteProductImage(image.get()); // 🔥 Cache törlés is megtörténik

        return ResponseEntity.ok().body("Image deleted successfully");
    }
}
