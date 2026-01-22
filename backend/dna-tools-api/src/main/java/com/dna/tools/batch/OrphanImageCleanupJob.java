package com.dna.tools.batch;

import com.dna.tools.domain.image.entity.UploadedImage;
import com.dna.tools.domain.image.repository.UploadedImageRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class OrphanImageCleanupJob {

    private final Path uploadDir;

    private final UploadedImageRepository uploadedImageRepository;

    public OrphanImageCleanupJob(UploadedImageRepository uploadedImageRepository,
            @Value("${file.upload.image-dir}") String uploadDir) {
        this.uploadedImageRepository = uploadedImageRepository;
        this.uploadDir = Paths.get(uploadDir);
    }

    @Scheduled(cron = "0 0 * * * *") // 매 시간
    public void cleanup() {

        LocalDateTime threshold = LocalDateTime.now().minusHours(1); // 현재 시간보다 1시간 이전 시간

        List<UploadedImage> orphans = uploadedImageRepository.findByUsedFalseAndCreatedAtBefore(threshold);
        // used=false이고 createdAt < threshold인 파일

        for (UploadedImage img : orphans) {
            deleteFile(img.getUrl());
            uploadedImageRepository.delete(img);
        }
    }

    private void deleteFile(String url) {
        try {
            String filename = url.replace("/images/", "");
            Path path = uploadDir.resolve(filename);
            Files.deleteIfExists(path);
        } catch (Exception e) {
            // 로그만 남기고 계속 진행
            System.err.println("고아 이미지 삭제 실패: " + url);
        }
    }
}
