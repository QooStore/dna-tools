package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "character_conditional_effects")
public class CharacterConditionalEffectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(name = "source_type", nullable = false, length = 20)
    private String sourceType; // SKILL / PASSIVE / INTRON

    @Column(name = "intron_stage")
    private Integer intronStage;

    @Column(name = "stat_type", nullable = false, length = 30)
    private String statType;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    public CharacterConditionalEffectEntity(CharacterEntity character, String sourceType, Integer intronStage,
            String statType, BigDecimal value) {
        this.character = character;
        this.sourceType = sourceType;
        this.intronStage = intronStage;
        this.statType = statType;
        this.value = value;
    }
}
