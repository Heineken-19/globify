package com.globify.service;

import com.globify.dto.ProductDTO;
import com.globify.entity.Category;
import com.globify.entity.ProductDetails;
import com.globify.entity.ProductImage;
import com.globify.repository.CategoryRepository;
import com.globify.repository.ProductDetailsRepository;
import com.globify.repository.ProductImageRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import com.globify.entity.Product;
import com.globify.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductDetailsRepository productDetailsRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ProductImageRepository productImageRepository, ProductDetailsRepository productDetailsRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;  // Injektáljuk a konstruktorba
        this.productDetailsRepository = productDetailsRepository;
    }

    // 🔹 Összes termék gyorsítótárazása
    @Cacheable(value = "products")
    public List<ProductDTO> getAllProducts(Long categoryId, String searchTerm) {
        List<Product> products = productRepository.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String pattern = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });

        return products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    // 🔹 Egyedi termék gyorsítótárazása
    @Cacheable(value = "products", key = "#productId")
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Termék nem található!"));

        ProductDetails details = productDetailsRepository.findByProductId(productId).orElse(null);
        product.setProductDetails(details);

        return new ProductDTO(product);
    }


    // 🔹 Ajánlott termékek gyorsítótárazása
    @Cacheable(value = "recommendedProducts", key = "#productId")
    public List<Product> getRecommendedProducts(Long productId) {
        List<Product> recommended = productRepository.findFrequentlyBoughtTogether(productId);

        if (recommended.isEmpty()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Termék nem található!"));
            recommended = productRepository.findTop5ByCategoryIdAndIdNotOrderByPriceDesc(product.getCategory().getId(), productId);
        }

        return recommended;
    }
    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public ProductDTO createProduct(Product product, List<MultipartFile> files, String light, String water, String extra, String fact) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Kategória nem található!"));

            // 🔥 Kategória ID explicit beállítása
            product.setCategory(category);
        }

        product.setId(null); // 🔹 Új termék létrehozásakor az ID-t null-ra állítjuk
        Product savedProduct = productRepository.save(product);

        if (files != null && !files.isEmpty()) {
            productImageRepository.deleteAllByProductId(savedProduct.getId());
            saveUploadedFiles(files, savedProduct);
        } else {
            productImageRepository.deleteAllByProductId(savedProduct.getId());
            setDefaultImage(savedProduct);
        }

        if (light != null || water != null || extra != null || fact != null) {
            ProductDetails details = ProductDetails.builder()
                    .product(savedProduct)
                    .light(light)
                    .water(water)
                    .extra(extra)
                    .fact(fact)
                    .build();
            productDetailsRepository.save(details);
        }

        return new ProductDTO(savedProduct);
    }


    @CacheEvict(value = "products", key = "#id")
    public Product updateProduct(Long id, Product updatedProduct, List<MultipartFile> files, String light, String water, String extra, String fact) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termék nem található!"));

        if (updatedProduct.getCategory() != null) {
            Category category = categoryRepository.findById(updatedProduct.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Kategória nem található!"));
            existingProduct.setCategory(category);
        }

        // Termék adatainak frissítése
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setTitle(updatedProduct.getTitle());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setSize(updatedProduct.getSize());
        existingProduct.setType(updatedProduct.getType());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setAvailable(updatedProduct.getAvailable());

        // Ha új fájlok vannak feltöltve, akkor mentsük azokat
        if (files != null && !files.isEmpty()) {
            deleteExistingImages(existingProduct);  // 🔹 Töröljük a régi képeket
            saveUploadedFiles(files, existingProduct);  // 🔹 Új képek feltöltése
        }

        ProductDetails existingDetails = productDetailsRepository.findByProductId(id).orElse(null);
        if (existingDetails != null) {
            existingDetails.setLight(light);
            existingDetails.setWater(water);
            existingDetails.setExtra(extra);
            existingDetails.setFact(fact);
            productDetailsRepository.save(existingDetails);
        } else if (light != null || water != null || extra != null || fact != null) {
            ProductDetails newDetails = ProductDetails.builder()
                    .product(existingProduct)
                    .light(light)
                    .water(water)
                    .extra(extra)
                    .fact(fact)
                    .build();
            productDetailsRepository.save(newDetails);
        }

        return productRepository.save(existingProduct);
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long productId) {
        productDetailsRepository.deleteByProductId(productId);
        productRepository.deleteById(productId);
    }

    private void setDefaultImage(Product product) {
        ProductImage defaultImage = new ProductImage();
        defaultImage.setProduct(product);
        defaultImage.setImagePath("default.jpg"); // 🔹 Default kép beállítása
        productImageRepository.save(defaultImage);
    }

    private void deleteExistingImages(Product product) {
        List<ProductImage> existingImages = productImageRepository.findByProductId(product.getId());
        productImageRepository.deleteAll(existingImages);
    }

    private void saveUploadedFiles(List<MultipartFile> files, Product product) {
        if (files == null || files.isEmpty()) {
            return;
        }

        List<ProductImage> images = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = storeFile(file);
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImagePath(fileName);
            images.add(image);
        }

        productImageRepository.saveAll(images);
    }


    public String storeFile(MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            Path uploadDir = Paths.get("uploads");

            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path targetLocation = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Nem sikerült a fájl mentése: " + ex.getMessage());
        }
    }

}
