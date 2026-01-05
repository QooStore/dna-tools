package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "introns")
public class IntronEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** N:1 연관관계 (주인) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(nullable = false)
    private int stage; // 1~6

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    public IntronEntity(
            CharacterEntity character,
            int stage,
            String description) {
        this.character = character;
        this.stage = stage;
        this.description = description;
    }
}
