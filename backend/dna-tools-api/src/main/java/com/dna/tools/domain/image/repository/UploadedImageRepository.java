package com.dna.tools.domain.image.repository;

import com.dna.tools.domain.image.entity.UploadedImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UploadedImageRepository extends JpaRepository<UploadedImage, Long> {

    Optional<UploadedImage> findByUrl(String url);

    List<UploadedImage> findByUsedFalseAndCreatedAtBefore(LocalDateTime time);
}
