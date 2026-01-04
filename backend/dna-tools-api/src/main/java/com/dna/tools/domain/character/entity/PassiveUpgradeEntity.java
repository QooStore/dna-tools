package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "character_passive_upgrades", uniqueConstraints = {
        @UniqueConstraint(name = "uk_character_upgrade", columnNames = { "character_id", "upgrade_key" }) })
public class PassiveUpgradeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** N:1 연관관계 (주인) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterEntity character;

    @Column(name = "upgrade_key", nullable = false, length = 50)
    private String upgradeKey;

    @Column(name = "upgrade_type", nullable = false, length = 10)
    private String upgradeType; // STAT / ABILITY / COOP

    @Column(name = "target_stat", length = 30)
    private String targetStat; // STAT, COOP 타입일 때만 사용

    @Column(precision = 6, scale = 2)
    private BigDecimal value; // STAT, COOP 타입일 때만 사용

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    protected PassiveUpgradeEntity() {
    }

    public PassiveUpgradeEntity(
            CharacterEntity character,
            String upgradeKey,
            String upgradeType,
            String targetStat,
            BigDecimal value,
            String name,
            String description) {
        this.character = character;
        this.upgradeKey = upgradeKey;
        this.upgradeType = upgradeType;
        this.targetStat = targetStat;
        this.value = value;
        this.name = name;
        this.description = description;
    }

    /** getter, setter */
    public Long getId() {
        return id;
    }

    public CharacterEntity getCharacter() {
        return character;
    }

    public String getUpgradeKey() {
        return upgradeKey;
    }

    public String getUpgradeType() {
        return upgradeType;
    }

    public String getTargetStat() {
        return targetStat;
    }

    public BigDecimal getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
