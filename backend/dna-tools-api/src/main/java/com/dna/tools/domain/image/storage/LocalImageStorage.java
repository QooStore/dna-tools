package com.dna.tools.domain.image.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

@Component
public class LocalImageStorage implements ImageStorage {

    private final Path uploadDir;
    private final String baseUrl;
    private static final String IMAGE_PATH_PREFIX = "/images/";

    public LocalImageStorage(
            @Value("${file.upload.image-dir}") String uploadDir,
            @Value("${app.image.base-url}") String baseUrl) {
        this.uploadDir = Paths.get(uploadDir);
        this.baseUrl = baseUrl;
    }

    @Override
    public String upload(MultipartFile file) {
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;
        Path filePath = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }

        return filename;
    }

    @Override
    public void delete(String filename) {
        try {
            Path path = uploadDir.resolve(filename);
            Files.deleteIfExists(path);
        } catch (Exception e) {
            // 파일 삭제 실패는 로그만 남기고 계속 진행
        }
    }

    @Override
    public String getUrl(String filename) {
        if (filename == null || filename.isBlank()) {
            return filename;
        }
        return baseUrl + IMAGE_PATH_PREFIX + filename;
    }

    @Override
    public String extractFilename(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        int idx = url.lastIndexOf(IMAGE_PATH_PREFIX);
        if (idx >= 0) {
            return url.substring(idx + IMAGE_PATH_PREFIX.length());
        }
        // 이미 filename만 있는 경우
        return url;
    }

    @Override
    public boolean exists(String filename) {
        return Files.exists(uploadDir.resolve(filename));
    }

    private String getExtension(String originalFilename) {
        return originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
    }
}
