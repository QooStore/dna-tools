package com.dna.tools.domain.admin.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageUploadService {

    private String baseUrl;
    private final Path uploadDir;
    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "webp");

    public ImageUploadService(@Value("${file.upload.image-dir}") String uploadDir,
            @Value("${app.image.base-url}") String baseUrl) {
        this.uploadDir = Paths.get(uploadDir);
        this.baseUrl = baseUrl;
    }

    public String upload(MultipartFile file) {

        validate(file);

        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;

        Path filePath = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }

        return baseUrl + "/images/" + filename;
    }

    public void validate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXT.contains(ext)) {
            throw new IllegalArgumentException("허용되지 않는 파일 형식입니다.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("이미지 용량은 5MB 이하여야 합니다.");
        }
    }

    private String getExtension(String originalFilename) {

        return originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
    }
}
