package com.sridevisarees.backend.controller;

import com.sridevisarees.backend.dto.ApiResponse;
import com.sridevisarees.backend.service.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    /**
     * Admin endpoint: safe image upload.
     * Enforces:
     * - Only image/jpeg, image/png, image/webp.
     * - Magic bytes inspection.
     * - 5 MB maximum size.
     * - Random UUID filenames.
     * - Rejection of SVG/XML.
     */
    @PostMapping("/uploads")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FileUploadService.UploadResult>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {
        FileUploadService.UploadResult result = fileUploadService.storeImage(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Image uploaded successfully.", result));
    }
}

