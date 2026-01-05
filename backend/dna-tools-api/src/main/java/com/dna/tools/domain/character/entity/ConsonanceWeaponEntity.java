package com.dna.tools.domain.character.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "consonance_weapons")
public class ConsonanceWeaponEntity {

    @Id
    @Column(name = "character_id")
    private Long characterId;

    /** 1:1 연관관계 (PK 공유 X) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id")
    private CharacterEntity character;

    @Column(nullable = false, length = 10)
    private String category;

    @Column(name = "weapon_type", nullable = false, length = 20)
    private String weaponType;

    @Column(name = "attack_type", nullable = false, length = 10)
    private String attackType;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal attack;

    @Column(name = "crit_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal critRate;

    @Column(name = "crit_damage", nullable = false, precision = 5, scale = 2)
    private BigDecimal critDamage;

    @Column(name = "attack_speed", nullable = false, precision = 4, scale = 2)
    private BigDecimal attackSpeed;

    @Column(name = "trigger_probability", nullable = false, precision = 5, scale = 2)
    private BigDecimal triggerProbability;

    public ConsonanceWeaponEntity(
            CharacterEntity character,
            String category,
            String weaponType,
            String attackType,
            BigDecimal attack,
            BigDecimal critRate,
            BigDecimal critDamage,
            BigDecimal attackSpeed,
            BigDecimal triggerProbability) {
        this.character = character;
        this.characterId = character.getId();
        this.category = category;
        this.weaponType = weaponType;
        this.attackType = attackType;
        this.attack = attack;
        this.critRate = critRate;
        this.critDamage = critDamage;
        this.attackSpeed = attackSpeed;
        this.triggerProbability = triggerProbability;
    }

}
