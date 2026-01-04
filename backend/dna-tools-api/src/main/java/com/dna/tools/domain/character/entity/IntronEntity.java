package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;

@Entity
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

    protected IntronEntity() {
    }

    public IntronEntity(
            CharacterEntity character,
            int stage,
            String description) {
        this.character = character;
        this.stage = stage;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public CharacterEntity getCharacter() {
        return character;
    }

    public int getStage() {
        return stage;
    }

    public String getDescription() {
        return description;
    }
}
