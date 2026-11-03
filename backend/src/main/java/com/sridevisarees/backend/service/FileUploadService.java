package com.sridevisarees.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Logger log = LoggerFactory.getLogger(FileUploadService.class);
    public static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    private final Path uploadLocation;

    public FileUploadService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
            log.info("FileUploadService initialized. Upload directory: {}", this.uploadLocation);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload storage directory: " + this.uploadLocation, e);
        }
    }

    public static class UploadResult {
        private final String url;
        private final String filename;
        private final long size;

        public UploadResult(String url, String filename, long size) {
            this.url = url;
            this.filename = filename;
            this.size = size;
        }

        public String getUrl() {
            return url;
        }

        public String getFilename() {
            return filename;
        }

        public long getSize() {
            return size;
        }
    }

    public UploadResult storeImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload failed: No file provided.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Upload failed: File size (" + (file.getSize() / 1024 / 1024) + " MB) exceeds 5 MB limit.");
        }

        String contentType = file.getContentType();
        if (contentType != null && (contentType.equalsIgnoreCase("image/svg+xml") || contentType.contains("svg"))) {
            throw new IllegalArgumentException("Upload rejected: SVG files are not permitted for security reasons.");
        }

        String extension = detectAndValidateExtension(file);

        // Generate unguessable random UUID filename
        String safeFilename = UUID.randomUUID().toString() + "." + extension;
        Path targetPath = this.uploadLocation.resolve(safeFilename).normalize();

        // Prevent path traversal
        if (!targetPath.startsWith(this.uploadLocation)) {
            throw new SecurityException("Upload rejected: Invalid storage path.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        log.info("Image successfully stored: {} ({} bytes)", safeFilename, file.getSize());

        return new UploadResult("/uploads/" + safeFilename, safeFilename, file.getSize());
    }

    /**
     * Inspects magic bytes (file signature) to strictly ensure file is JPEG, PNG, or WebP.
     * Rejects corrupted headers, executables, scripts, or SVG masquerading as images.
     */
    public String detectAndValidateExtension(MultipartFile file) throws IOException {
        byte[] header = new byte[12];
        int bytesRead;

        try (InputStream is = file.getInputStream()) {
            bytesRead = is.read(header);
        }

        if (bytesRead < 4) {
            throw new IllegalArgumentException("Upload rejected: File is too small or header is unreadable.");
        }

        // JPEG Magic Bytes: FF D8 FF
        if ((header[0] & 0xFF) == 0xFF &&
            (header[1] & 0xFF) == 0xD8 &&
            (header[2] & 0xFF) == 0xFF) {
            return "jpg";
        }

        // PNG Magic Bytes: 89 50 4E 47 0D 0A 1A 0A
        if (bytesRead >= 8 &&
            (header[0] & 0xFF) == 0x89 &&
            (header[1] & 0xFF) == 0x50 &&
            (header[2] & 0xFF) == 0x4E &&
            (header[3] & 0xFF) == 0x47 &&
            (header[4] & 0xFF) == 0x0D &&
            (header[5] & 0xFF) == 0x0A &&
            (header[6] & 0xFF) == 0x1A &&
            (header[7] & 0xFF) == 0x0A) {
            return "png";
        }

        // WebP Magic Bytes: RIFF (bytes 0-3) and WEBP (bytes 8-11)
        if (bytesRead >= 12 &&
            header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F' &&
            header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
            return "webp";
        }

        throw new IllegalArgumentException("Upload rejected: Unsupported file format. Only JPEG, PNG, and WebP images are allowed.");
    }
}

