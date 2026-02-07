package com.dna.tools.domain.admin.service;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dna.tools.domain.image.entity.UploadedImage;
import com.dna.tools.domain.image.repository.UploadedImageRepository;
import com.dna.tools.domain.image.storage.ImageStorage;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final UploadedImageRepository uploadedImageRepository;
    private final ImageStorage imageStorage;

    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "webp");

    /** 파일 검증 → 저장 → DB 기록 → full URL 반환 */
    public String upload(MultipartFile file) {
        validate(file);

        String filename = imageStorage.upload(file);

        uploadedImageRepository.save(new UploadedImage(filename));

        return imageStorage.getUrl(filename);
    }

    private void validate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.IMAGE_EMPTY);
        }

        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXT.contains(ext)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        if (file.getSize() > 20 * 1024 * 1024) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }
    }

    private String getExtension(String originalFilename) {
        return originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
    }
}
