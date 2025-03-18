package com.globify.controller;

import com.globify.service.ProductImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/products/import")
public class ProductImportController {

    private final ProductImportService productImportService;

    public ProductImportController(ProductImportService productImportService) {
        this.productImportService = productImportService;
    }

    @PostMapping
    public ResponseEntity<String> importProducts(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Üres fájl nem importálható!");
        }

        try {
            productImportService.importProductsFromExcel(file);
            return ResponseEntity.ok("Termékek sikeresen importálva!");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Hiba az importálás során: " + e.getMessage());
        }
    }
}
