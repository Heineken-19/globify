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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;

import java.io.IOException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductDetailsRepository productDetailsRepository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ProductImageRepository productImageRepository, ProductDetailsRepository productDetailsRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;  // Injektáljuk a konstruktorba
        this.productDetailsRepository = productDetailsRepository;
        this.fileStorageService = fileStorageService;
    }

    // 🔹 Összes termék gyorsítótárazása
    @Cacheable(value = "products")
    public Page<ProductDTO> getAllProducts(List<String> categoryNames, String searchTerm, int page, int size, Boolean isNew, Boolean isSale, Boolean available,
                                           List<String> light, List<String> water, List<String> type, Integer minMainSize, Integer maxMainSize, Double minPrice, Double maxPrice, Boolean isPopular) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<Product> spec = Specification.where(null);

            List<Predicate> predicates = new ArrayList<>();

        if (categoryNames != null && !categoryNames.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("category").get("name").in(categoryNames));
        }

        if (searchTerm != null && !searchTerm.isEmpty()) {
            String pattern = "%" + searchTerm.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern));
        }

        if (available != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("available"), available));
        }

        if (isNew != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("isNew"), isNew));
        }

        if (isSale != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("isSale"), isSale));
        }

        if (minMainSize != null) {
            spec = spec.and((root, query, cb) -> cb.ge(root.get("mainSize"), minMainSize));
        }
        if (maxMainSize != null) {
            spec = spec.and((root, query, cb) -> cb.le(root.get("mainSize"), maxMainSize));
        }

        if (light != null && !light.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.join("productDetails").get("light").in(light));
        }

        if (water != null && !water.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.join("productDetails").get("water").in(water));
        }

        if (type != null && !type.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Predicate typePredicate = cb.disjunction();
                for (String t : type) {
                    typePredicate = cb.or(typePredicate, cb.like(cb.lower(root.get("type")), "%" + t.toLowerCase() + "%"));
                }
                return typePredicate;
            });
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.ge(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.le(root.get("price"), maxPrice));
        }

        if (Boolean.TRUE.equals(isPopular)) {
            List<Long> ids = productRepository.findMostPopularProductIds(pageable);
            List<Product> popularProducts = productRepository.findAllById(ids);
            List<ProductDTO> dtoList = popularProducts.stream()
                    .map(ProductDTO::new)
                    .collect(Collectors.toList());
            return new PageImpl<>(dtoList, pageable, dtoList.size());
        }


        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return productPage.map(ProductDTO::new);
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
            product.setCategory(category);
        }

        product.setId(null);
        product.setDiscountPercentage(product.getDiscountPercentage());
        product.setMainSize(extractMainSize(product.getSize()));
        product.setSlug(generateSlug(product.getName()));
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

        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setSlug(generateSlug(updatedProduct.getName()));
        }
        if (updatedProduct.getTitle() != null) {
            existingProduct.setTitle(updatedProduct.getTitle());
        }
        if (updatedProduct.getDescription() != null) {
            existingProduct.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getSize() != null) {
            existingProduct.setSize(updatedProduct.getSize());
        }
        if (updatedProduct.getType() != null) {
            existingProduct.setType(updatedProduct.getType());
        }
        if (updatedProduct.getPrice() != null) {
            existingProduct.setPrice(updatedProduct.getPrice());
        }
        if (updatedProduct.getStock() != null) {
            existingProduct.setStock(updatedProduct.getStock());
        }
        if (updatedProduct.getAvailable() != null) {
            existingProduct.setAvailable(updatedProduct.getAvailable());
        }
        if (updatedProduct.getIsNew() != null) {
            existingProduct.setIsNew(updatedProduct.getIsNew());
        }
        if (updatedProduct.getIsSale() != null) {
            existingProduct.setIsSale(updatedProduct.getIsSale());
        }
        if (updatedProduct.getDiscountPercentage() != null) {
            existingProduct.setDiscountPercentage(updatedProduct.getDiscountPercentage());
        }

        if (updatedProduct.getSize() != null) {
            existingProduct.setSize(updatedProduct.getSize());
            Double mainSizeValue = extractMainSize(updatedProduct.getSize());
            existingProduct.setMainSize(mainSizeValue); // új méret alapján
        }

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

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Termék nem található slug alapján"));
        return new ProductDTO(product);
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
            try {
                String fileName = fileStorageService.saveFile(file); // ✅ kezelt
                ProductImage image = new ProductImage();
                image.setProduct(product);
                image.setImagePath(fileName);
                images.add(image);
            } catch (IOException e) {
                // Logolhatod vagy akár dobhatod tovább egy runtime exception-nel
                throw new RuntimeException("Nem sikerült a fájl mentése: " + e.getMessage());
            }
        }

        productImageRepository.saveAll(images);
    }


    @Cacheable(value = "products", key = "'new'")
    public List<ProductDTO> getNewProducts() {
        List<Product> newProducts = productRepository.findByIsNewTrueAndAvailableTrue();
        return newProducts.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "products", key = "'sale'")
    public List<ProductDTO> getSaleProducts() {
        List<Product> newProducts = productRepository.findByIsSaleTrueAndAvailableTrue();
        return newProducts.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    private Double extractMainSize(String size) {
        if (size == null || size.trim().isEmpty()) {
            return null;
        }

        // Numerikus érték ellenőrzése
        try {
            // Közvetlenül visszaadjuk, ha numerikus
            return Double.parseDouble(size);
        } catch (NumberFormatException e) {
            // Ha nem numerikus, keresünk számot a szövegben
            String numericPart = size.replaceAll("[^0-9.]", ""); // Csak számok és pont maradnak
            if (!numericPart.isEmpty()) {
                try {
                    return Double.parseDouble(numericPart);
                } catch (NumberFormatException ex) {
                    return null;
                }
            }
        }
        return null; // Ha nem található szám
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9áéíóöőúüű\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-");
    }

}
