package com.globify.test.controller;

import com.globify.controller.FileUploadController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileUploadControllerTest {

    private FileUploadController fileUploadController;

    @Value("${newsletter.upload-dir}")
    private String uploadDir = "uploads/newsletter/";

    @Value("${newsletter.public-url-prefix}")
    private String publicUrlPrefix = "http://localhost/newsletter/";

    @BeforeEach
    void setUp() {
        fileUploadController = new FileUploadController(uploadDir, publicUrlPrefix);
         {{
            uploadDir = FileUploadControllerTest.this.uploadDir;
            publicUrlPrefix = FileUploadControllerTest.this.publicUrlPrefix;
        }};
    }

    @Test
    void testUploadFiles_Success() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("test.jpg");
        when(file.getInputStream()).thenReturn(mock(InputStream.class));

        ResponseEntity<List<String>> response = fileUploadController.uploadFiles(new MultipartFile[]{file});

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }

    @Test
    void testUploadFiles_Failure() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("badfile.jpg");
        when(file.getInputStream()).thenThrow(new IOException("Failed to read file"));

        ResponseEntity<List<String>> response = fileUploadController.uploadFiles(new MultipartFile[]{file});

        assertEquals(500, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().get(0).contains("Hiba a feltöltés során"));
    }
}
