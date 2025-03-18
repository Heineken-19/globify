package com.globify.service;

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

    private static final String UPLOAD_DIR = "uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        // Ellenőrizzük, hogy létezik-e az uploads mappa
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generálunk egy egyedi fájlnevet
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);

        // Fájl mentése
        Files.write(filePath, file.getBytes());

        return fileName; // Ezt az adatbázisba mentjük
    }

    public String saveFileFromPath(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("A fájl nem található: " + filePath);
        }

        // Ellenőrizzük, hogy létezik-e az uploads mappa
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generálunk egy egyedi fájlnevet
        String fileName = UUID.randomUUID().toString() + "_" + file.getName();
        Path destinationPath = Paths.get(UPLOAD_DIR + fileName);

        // Másolás az új helyre
        Files.copy(file.toPath(), destinationPath);

        return fileName; // Az új fájl neve az adatbázishoz
    }

    public byte[] loadFile(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        return Files.readAllBytes(filePath);
    }

    public boolean deleteFile(String fileName) {
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        try {
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        }
    }
}
