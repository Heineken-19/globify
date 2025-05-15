package com.globify.test.controller;

import com.globify.controller.FileController;
import com.globify.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileControllerTest {

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private FileController fileController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetFile_Success() throws IOException {
        String fileName = "test.jpg";
        byte[] fileData = new byte[]{1, 2, 3};

        when(fileStorageService.loadFile(fileName)).thenReturn(fileData);

        ResponseEntity<byte[]> response = fileController.getFile(fileName);

        assertEquals(200, response.getStatusCodeValue());
        assertArrayEquals(fileData, response.getBody());
    }

    @Test
    void testGetFile_FileNotFound() throws IOException {
        String fileName = "missing.jpg";

        when(fileStorageService.loadFile(fileName)).thenThrow(new IOException());

        ResponseEntity<byte[]> response = fileController.getFile(fileName);

        assertEquals(404, response.getStatusCodeValue());
    }
}
