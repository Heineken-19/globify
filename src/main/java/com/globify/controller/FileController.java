package com.globify.controller;

import com.globify.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) {
        try {
            byte[] fileData = fileStorageService.loadFile(fileName);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileData);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
