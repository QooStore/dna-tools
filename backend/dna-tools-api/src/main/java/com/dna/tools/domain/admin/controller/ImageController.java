package com.dna.tools.domain.admin.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dna.tools.domain.admin.dto.ImageUploadResponse;
import com.dna.tools.domain.admin.service.ImageUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee/upload")
public class ImageController {

    private final ImageUploadService imageUploadService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/image")
    public ImageUploadResponse uploadImage(@RequestPart("file") MultipartFile file) {
        String url = imageUploadService.upload(file);
        return new ImageUploadResponse(url);
    }
}
