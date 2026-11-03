package com.sridevisarees.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileUploadServiceTest {

    @TempDir
    Path tempUploadDir;

    private FileUploadService fileUploadService;

    @BeforeEach
    void setUp() {
        fileUploadService = new FileUploadService(tempUploadDir.toString());
    }

    @Test
    @DisplayName("Rejects SVG file upload by content type")
    void testRejectsSvgUpload() {
        MockMultipartFile svgFile = new MockMultipartFile(
                "file",
                "malicious.svg",
                "image/svg+xml",
                "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>".getBytes()
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> fileUploadService.storeImage(svgFile));
        assertTrue(ex.getMessage().contains("SVG files are not permitted"));
    }

    @Test
    @DisplayName("Rejects files larger than 5 MB")
    void testRejectsOversizedFile() {
        byte[] oversizedData = new byte[5 * 1024 * 1024 + 1024]; // 5MB + 1KB
        MockMultipartFile largeFile = new MockMultipartFile(
                "file",
                "large.jpg",
                "image/jpeg",
                oversizedData
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> fileUploadService.storeImage(largeFile));
        assertTrue(ex.getMessage().contains("exceeds 5 MB limit"));
    }

    @Test
    @DisplayName("Rejects file with invalid magic bytes even if filename ends in .jpg")
    void testRejectsFakeJpgWithInvalidMagicBytes() {
        byte[] textContent = "This is a plain text file masquerading as a JPEG image.".getBytes();
        MockMultipartFile fakeJpg = new MockMultipartFile(
                "file",
                "fake.jpg",
                "image/jpeg",
                textContent
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> fileUploadService.storeImage(fakeJpg));
        assertTrue(ex.getMessage().contains("Unsupported file format"));
    }

    @Test
    @DisplayName("Accepts valid PNG with magic bytes and generates random UUID filename")
    void testAcceptsValidPngImage() throws IOException {
        // Valid PNG header: 89 50 4E 47 0D 0A 1A 0A followed by dummy data
        byte[] pngData = new byte[]{
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x0D, 'I', 'H', 'D', 'R'
        };

        MockMultipartFile validPng = new MockMultipartFile(
                "file",
                "sample-saree.png",
                "image/png",
                pngData
        );

        FileUploadService.UploadResult result = fileUploadService.storeImage(validPng);

        assertNotNull(result);
        assertTrue(result.getUrl().startsWith("/uploads/"));
        assertTrue(result.getFilename().endsWith(".png"));
        assertNotEquals("sample-saree.png", result.getFilename(), "Should generate unguessable UUID filename");
    }

    @Test
    @DisplayName("Accepts valid JPEG with magic bytes")
    void testAcceptsValidJpegImage() throws IOException {
        // Valid JPEG header: FF D8 FF E0
        byte[] jpegData = new byte[]{
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
                0x00, 0x10, 'J', 'F', 'I', 'F', 0x00, 0x01
        };

        MockMultipartFile validJpeg = new MockMultipartFile(
                "file",
                "photo.jpeg",
                "image/jpeg",
                jpegData
        );

        FileUploadService.UploadResult result = fileUploadService.storeImage(validJpeg);

        assertNotNull(result);
        assertTrue(result.getUrl().startsWith("/uploads/"));
        assertTrue(result.getFilename().endsWith(".jpg"));
    }
}

