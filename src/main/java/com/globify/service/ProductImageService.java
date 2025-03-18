package com.globify.service;

import com.globify.entity.ProductImage;
import com.globify.repository.ProductImageRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final FileStorageService fileStorageService;

    public ProductImageService(ProductImageRepository productImageRepository, FileStorageService fileStorageService) {
        this.productImageRepository = productImageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Cacheable(value = "productImages", key = "#productId") // 🔥 Cache bevezetése Redis-ben
    public List<ProductImage> getProductImages(Long productId) {
        return productImageRepository.findByProductId(productId);
    }

    @CacheEvict(value = "productImages", key = "#image.product.id") // 🔥 Cache törlése a termék képeiről
    public void deleteProductImage(ProductImage image) {
        fileStorageService.deleteFile(image.getImagePath()); // Fájl törlése
        productImageRepository.delete(image);
    }
}
