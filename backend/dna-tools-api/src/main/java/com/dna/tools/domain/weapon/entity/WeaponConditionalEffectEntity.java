package com.dna.tools.domain.weapon.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "weapon_conditional_effects")
public class WeaponConditionalEffectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weapon_id", nullable = false)
    private WeaponEntity weapon;

    @Column(name = "stat_type", nullable = false, length = 30)
    private String statType;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    public WeaponConditionalEffectEntity(WeaponEntity weapon, String statType, BigDecimal value) {
        this.weapon = weapon;
        this.statType = statType;
        this.value = value;
    }
}
