package com.globify.service;

import com.globify.dto.ProductDTO;
import com.globify.entity.Category;
import com.globify.entity.Product;
import com.globify.entity.ProductDetails;
import com.globify.entity.ProductImage;
import com.globify.repository.CategoryRepository;
import com.globify.repository.ProductDetailsRepository;
import com.globify.repository.ProductImageRepository;
import com.globify.repository.ProductRepository;
import com.globify.specification.ProductSpecification;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductDetailsRepository productDetailsRepository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductImageRepository productImageRepository,
                          ProductDetailsRepository productDetailsRepository,
                          FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.productDetailsRepository = productDetailsRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDTO saveOrUpdateProduct(Long id, ProductDTO productDTO, List<MultipartFile> files,
                                          String light, String water, String extra, String fact) {
        Product product = (id != null) ? productRepository.findById(id).orElse(new Product()) : new Product();
        updateProductFromDTO(product, productDTO);

        // ✅ Kedvezmény csak akkor kerül beállításra, ha isSale = true
        if (Boolean.TRUE.equals(productDTO.getIsSale())) {
            product.setDiscountPercentage(productDTO.getDiscountPercentage());
        } else {
            product.setDiscountPercentage(null);
        }

        // ✅ Light, water, extra, fact értékek mentése
        saveOrUpdateProductDetails(product, light, water, extra, fact);

        Product savedProduct = productRepository.save(product);
        handleProductImages(files, savedProduct);
        return new ProductDTO(savedProduct);
    }

    private void updateProductFromDTO(Product product, ProductDTO productDTO) {
        product.setName(productDTO.getName());
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setSlug(generateSlug(productDTO.getName()));
        product.setSize(validateSize(productDTO.getSize()));
        product.setPrice(Optional.ofNullable(productDTO.getPrice()).orElse(BigDecimal.ZERO));
        product.setAvailable(Optional.ofNullable(productDTO.getAvailable()).orElse(true));
        product.setIsNew(Optional.ofNullable(productDTO.getIsNew()).orElse(false));
        product.setIsSale(Optional.ofNullable(productDTO.getIsSale()).orElse(false));
        product.setDiscountPercentage(productDTO.getDiscountPercentage());
        product.setStock(productDTO.getStock());
        product.setMainSize(productDTO.getMainSize());
        product.setType(productDTO.getType());
    }

    private void saveOrUpdateProductDetails(Product product, String light, String water, String extra, String fact) {
        ProductDetails details = productDetailsRepository.findByProductId(product.getId()).orElse(new ProductDetails());
        details.setProduct(product);
        details.setLight(light);
        details.setWater(water);
        details.setExtra(extra);
        details.setFact(fact);
        productDetailsRepository.save(details);
    }

    private void handleProductImages(List<MultipartFile> files, Product product) {
        if (files != null && !files.isEmpty()) {

            productImageRepository.deleteAllByProductId(product.getId());

            List<ProductImage> images = files.stream()
                    .map(file -> createProductImage(file, product))
                    .collect(Collectors.toList());

            productImageRepository.saveAll(images);
        }
    }

    private ProductImage createProductImage(MultipartFile file, Product product) {
        try {
            String fileName = fileStorageService.saveFile(file);
            return ProductImage.builder()
                    .product(product)
                    .imagePath(fileName)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("Nem sikerült a fájl mentése: " + e.getMessage());
        }
    }

    private String validateSize(String size) {
        return (size != null && size.length() > 255) ? size.substring(0, 255) : size;
    }

    private String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "nincs-megadott-nev";
        }

        return name.toLowerCase()
                .replaceAll("[^a-z0-9áéíóöőúüű\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-");
    }

    private Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Kategória nem található!"));
    }

    @Cacheable(value = "products")
    public Page<ProductDTO> getAllAvailableProducts(
            List<String> categories, String searchTerm, Boolean isNew, Boolean isSale,
            List<String> light, List<String> water, List<String> type,
            Double minMainSize, Double maxMainSize, BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable) {

        // 🔹 Mindig csak az elérhető termékeket szűrjük (available = true)
        Specification<Product> spec = Specification.where(ProductSpecification.hasCategory(categories))
                .and(ProductSpecification.hasSearchTerm(searchTerm))
                .and(ProductSpecification.isNew(isNew))
                .and(ProductSpecification.isSale(isSale))
                .and(ProductSpecification.isAvailable(true)) // ✅ Csak elérhető termékek
                .and(ProductSpecification.hasLight(light))
                .and(ProductSpecification.hasWater(water))
                .and(ProductSpecification.hasType(type))
                .and(ProductSpecification.hasSizeBetween(minMainSize, maxMainSize))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        return productRepository.findAll(spec, pageable).map(ProductDTO::new);
    }

    // 🔹 Minden termék listázása (Admin oldal)
    @Cacheable(value = "products_admin")
    public Page<ProductDTO> getAllProductsForAdmin(
            List<String> categories, String searchTerm, Boolean isNew, Boolean isSale, Boolean available,
            List<String> light, List<String> water, List<String> type,
            Double minMainSize, Double maxMainSize, BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable) {

        // 🔹 Minden termék listázása, függetlenül az elérhetőségtől
        Specification<Product> spec = Specification.where(ProductSpecification.hasCategory(categories))
                .and(ProductSpecification.hasSearchTerm(searchTerm))
                .and(ProductSpecification.isNew(isNew))
                .and(ProductSpecification.isSale(isSale))
                .and(ProductSpecification.isAvailable(available)) // ✅ Elérhető vagy nem elérhető is
                .and(ProductSpecification.hasLight(light))
                .and(ProductSpecification.hasWater(water))
                .and(ProductSpecification.hasType(type))
                .and(ProductSpecification.hasSizeBetween(minMainSize, maxMainSize))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        return productRepository.findAll(spec, pageable).map(ProductDTO::new);
    }


    @Cacheable(value = "products", key = "#productId")
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Termék nem található!"));
        return new ProductDTO(product);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Termék nem található slug alapján"));
        return new ProductDTO(product);
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

    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public void deleteProduct(Long id) {
        productImageRepository.deleteAllByProductId(id);
        productDetailsRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }
}
