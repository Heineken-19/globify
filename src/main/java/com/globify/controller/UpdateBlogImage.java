package com.globify.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads/blog")
public class UpdateBlogImage {

    private final String uploadDir;
    private final String publicUrlPrefix;

    public UpdateBlogImage(
            @Value("${blog.upload-dir}") String uploadDir,
            @Value("${blog.public-url-prefix}") String publicUrlPrefix) {
        this.uploadDir = uploadDir;
        this.publicUrlPrefix = publicUrlPrefix;
    }

    @PostMapping
    public ResponseEntity<List<String>> uploadBlogImages(@RequestParam("files") MultipartFile[] files) {
        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String originalFilename = file.getOriginalFilename();
                String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_"); // csak biztonságos karakterek
                String fileName = UUID.randomUUID() + "_" + safeFilename;
                Path targetPath = Paths.get(uploadDir, fileName);
                Files.createDirectories(targetPath.getParent());
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                uploadedUrls.add(publicUrlPrefix + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(List.of("Hiba a feltöltés során: " + e.getMessage()));
            }
        }

        return ResponseEntity.ok(uploadedUrls);
    }
}
