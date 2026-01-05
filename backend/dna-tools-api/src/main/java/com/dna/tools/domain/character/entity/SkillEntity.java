package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "skills")
public class SkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** N:1 연관관계 (주인) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 20)
    private String type; // 대미지 / 버프 / 패시브

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    public SkillEntity(
            CharacterEntity character,
            String name,
            String type,
            String description) {
        this.character = character;
        this.name = name;
        this.type = type;
        this.description = description;
    }

}