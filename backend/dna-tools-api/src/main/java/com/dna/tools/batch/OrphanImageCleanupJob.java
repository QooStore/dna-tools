package com.dna.tools.batch;

import com.dna.tools.domain.image.entity.UploadedImage;
import com.dna.tools.domain.image.repository.UploadedImageRepository;
import com.dna.tools.domain.image.storage.ImageStorage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrphanImageCleanupJob {

    private final UploadedImageRepository uploadedImageRepository;
    private final ImageStorage imageStorage;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanup() {
        log.info("고아 이미지 정리 작업 시작");

        LocalDateTime threshold = LocalDateTime.now().minusHours(1);

        List<UploadedImage> orphans = uploadedImageRepository.findByUsedFalseAndCreatedAtBefore(threshold);

        for (UploadedImage img : orphans) {
            imageStorage.delete(img.getFilename());
            uploadedImageRepository.delete(img);
        }

        log.info("고아 이미지 정리 작업 완료. 삭제 건수={}", orphans.size());
    }
}
