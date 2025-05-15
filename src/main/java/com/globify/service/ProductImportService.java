package com.globify.service;

import com.globify.entity.Product;
import com.globify.entity.ProductDetails;
import com.globify.entity.ProductImage;
import com.globify.repository.ProductRepository;
import com.globify.repository.CategoryRepository;
import com.globify.repository.ProductImageRepository;
import com.globify.repository.ProductDetailsRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ProductImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductDetailsRepository productDetailsRepository;
    private final FileStorageService fileStorageService;

    public ProductImportService(ProductRepository productRepository,
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

    public void importProductsFromExcel(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            rowIterator.next(); // Az első sor fejléc, kihagyjuk

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Product product = new Product();

                product.setName(getCellValue(row.getCell(0)));
                product.setSlug(generateSlug(product.getName()));
                product.setTitle(getCellValue(row.getCell(1)));
                product.setDescription(getCellValue(row.getCell(2)));
                product.setPrice(new BigDecimal(getCellValue(row.getCell(3))));
                product.setSize(getCellValue(row.getCell(4)));
                product.setStock(Integer.parseInt(getCellValue(row.getCell(5))));
                product.setType(getCellValue(row.getCell(6)));

                Long categoryId = Long.parseLong(getCellValue(row.getCell(7)));
                product.setCategory(categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Kategória nem található!")));

                String availableValue = getCellValue(row.getCell(8)).toLowerCase();
                boolean isAvailable = availableValue.equals("true") || availableValue.equals("1");
                product.setAvailable(isAvailable); // 🔹 Automatikusan 1 vagy 0 lesz SQL-ben

                String isNewValue = getCellValue(row.getCell(9)).toLowerCase();
                product.setIsNew(isNewValue.equals("true") || isNewValue.equals("1"));

                String isSaleValue = getCellValue(row.getCell(10)).toLowerCase();
                product.setIsSale(isSaleValue.equals("true") || isSaleValue.equals("1"));

                // 🔹 Termék mentése
                Product savedProduct = productRepository.save(product);

                // 🔹 Részletek mentése külön entitásként
                ProductDetails details = new ProductDetails();
                details.setProduct(savedProduct);


                details.setLight(getCellValue(row.getCell(11)));
                details.setWater(getCellValue(row.getCell(12)));
                details.setExtra(getCellValue(row.getCell(13)));
                details.setFact(getCellValue(row.getCell(14)));

                productDetailsRepository.save(details);

                // 🔹 Képfájlok feltöltése és kapcsolása a termékhez
                String imagesPath = getCellValue(row.getCell(15)); // Több kép vesszővel elválasztva
                if (imagesPath != null && !imagesPath.isBlank()) {
                    String[] imagePaths = imagesPath.split(","); // Ha több kép van
                    List<ProductImage> productImages = new ArrayList<>();

                    for (String imagePath : imagePaths) {
                        String uploadedFileName = uploadImage(imagePath.trim());
                        ProductImage productImage = new ProductImage();
                        productImage.setProduct(savedProduct);
                        productImage.setImagePath(uploadedFileName);
                        productImages.add(productImage);
                    }
                    productImageRepository.saveAll(productImages);
                }
            }
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private String uploadImage(String filePath) throws IOException {
        return fileStorageService.saveFileFromPath(filePath); // Használjuk az új metódust
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9áéíóöőúüű\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-");
    }
}
