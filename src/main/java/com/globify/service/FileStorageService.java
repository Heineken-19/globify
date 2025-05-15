package com.globify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${product.upload-dir}")
    private String productUploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        Path rootPath = Paths.get("").toAbsolutePath();
        Path uploadPath = rootPath.resolve(productUploadDir); // Ez lesz pl. uploads/products

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String cleanedName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = UUID.randomUUID().toString() + "_" + cleanedName;

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        System.out.println("✅ Mentés teljes útvonala: " + filePath.toAbsolutePath());

        return fileName;
    }


    public String saveFileFromPath(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("A fájl nem található: " + filePath);
        }

        Path rootPath = Paths.get("").toAbsolutePath();
        Path uploadPath = rootPath.resolve(productUploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getName();
        Path destinationPath = uploadPath.resolve(fileName);

        Files.copy(file.toPath(), destinationPath);

        return fileName;
    }

    public byte[] loadFile(String fileName) throws IOException {
        Path rootPath = Paths.get("").toAbsolutePath();
        Path filePath = rootPath.resolve(productUploadDir).resolve(fileName);
        return Files.readAllBytes(filePath);
    }

    public boolean deleteFile(String fileName) {
        try {
            Path rootPath = Paths.get("").toAbsolutePath();
            Path filePath = rootPath.resolve(productUploadDir).resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        }
    }
}
