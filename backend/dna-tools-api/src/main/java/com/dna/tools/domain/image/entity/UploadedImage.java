package com.dna.tools.domain.image.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "uploaded_images")
public class UploadedImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String url;

    @Column(nullable = false)
    private boolean used = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public UploadedImage(String url) {
        this.url = url;
        this.createdAt = LocalDateTime.now();
    }

    public void markUsed() {
        this.used = true;
    }

    public void markUnused() {
        this.used = false;
    }
}
