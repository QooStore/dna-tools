package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "character_features")
public class CharacterFeatureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** N:1 연관관계 (주인) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(nullable = false, length = 50)
    private String feature;

    protected CharacterFeatureEntity() {
    }

    public CharacterFeatureEntity(CharacterEntity character, String feature) {
        this.character = character;
        this.feature = feature;
    }

    public Long getId() {
        return id;
    }

    public CharacterEntity getCharacter() {
        return character;
    }

    public String getFeature() {
        return feature;
    }
}
