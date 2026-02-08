package com.dna.tools.domain.image.service;

import com.dna.tools.domain.image.entity.UploadedImage;
import com.dna.tools.domain.image.repository.UploadedImageRepository;
import com.dna.tools.domain.image.storage.ImageStorage;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageUsageService {

    private final UploadedImageRepository uploadedImageRepository;
    private final ImageStorage imageStorage;

    /** full URL → filename 추출 */
    public String extractFilename(String urlOrFilename) {
        return imageStorage.extractFilename(urlOrFilename);
    }

    /** 업로드된 이미지들을 사용 중으로 표시 */
    public void markUsed(String... filenames) {
        for (String filename : filenames) {
            if (filename == null || filename.isBlank())
                continue;

            uploadedImageRepository
                    .findByFilename(filename)
                    .ifPresent(UploadedImage::markUsed);
        }
    }

    /** 업로드된 이미지들을 미사용으로 표시 */
    public void markUnused(String... filenames) {
        for (String filename : filenames) {
            if (filename == null || filename.isBlank())
                continue;

            uploadedImageRepository.findByFilename(filename)
                    .ifPresent(UploadedImage::markUnused);
        }
    }

    /** 이전 이미지와 현재 이미지가 다를 때만 이전 이미지를 미사용 처리 */
    public void unmarkIfChanged(String prev, String current) {
        if (prev == null || prev.isBlank())
            return;
        if (prev.equals(current))
            return;

        uploadedImageRepository.findByFilename(prev)
                .ifPresent(UploadedImage::markUnused);
    }
}
