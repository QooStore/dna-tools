package com.dna.tools.domain.weapon.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "weapons", uniqueConstraints = {
        @UniqueConstraint(name = "uk_weapon_slug", columnNames = "slug")
})
public class WeaponEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String image;

    // --- 분류 ---
    @Column(nullable = false, length = 10)
    private String category;

    @Column(name = "weapon_type", nullable = false, length = 20)
    private String weaponType;

    @Column(name = "attack_type", nullable = false, length = 10)
    private String attackType;

    @Column(length = 10)
    private String element;

    // --- 공통 스탯 ---
    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal attack;

    @Column(name = "crit_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal critRate;

    @Column(name = "crit_damage", nullable = false, precision = 5, scale = 2)
    private BigDecimal critDamage;

    @Column(name = "attack_speed", nullable = false, precision = 4, scale = 2)
    private BigDecimal attackSpeed;

    @Column(name = "trigger_probability", nullable = false, precision = 5, scale = 2)
    private BigDecimal triggerProbability;

    // --- 근접 전용 ---
    @Column(name = "charge_attack_speed", precision = 4, scale = 2)
    private BigDecimal chargeAttackSpeed;

    @Column(name = "fall_attack_speed", precision = 4, scale = 2)
    private BigDecimal fallAttackSpeed;

    // --- 원거리 전용 ---
    @Column(name = "multi_shot")
    private Integer multiShot;

    @Column(name = "max_ammo")
    private Integer maxAmmo;

    @Column(name = "ammo_conversion_rate", precision = 5, scale = 2)
    private BigDecimal ammoConversionRate;

    // --- 패시브 스킬 ---
    @Column(name = "passive_stat", length = 30)
    private String passiveStat;

    @Column(name = "passive_value", precision = 6, scale = 2)
    private BigDecimal passiveValue;

    // --- 액티브 스킬 ---
    @Column(name = "active_skill_description", columnDefinition = "TEXT")
    private String activeSkillDescription;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // ===== 생성 팩토리 =====
    public static WeaponEntity create(
            String slug, String name, String image,
            String category, String weaponType, String attackType, String element,
            BigDecimal attack, BigDecimal critRate, BigDecimal critDamage,
            BigDecimal attackSpeed, BigDecimal triggerProbability,
            BigDecimal chargeAttackSpeed, BigDecimal fallAttackSpeed,
            Integer multiShot, Integer maxAmmo, BigDecimal ammoConversionRate,
            String passiveStat, BigDecimal passiveValue, String activeSkillDescription) {
        WeaponEntity w = new WeaponEntity();
        w.slug = slug;
        w.name = name;
        w.image = image;
        w.category = category;
        w.weaponType = weaponType;
        w.attackType = attackType;
        w.element = element;
        w.attack = attack;
        w.critRate = critRate;
        w.critDamage = critDamage;
        w.attackSpeed = attackSpeed;
        w.triggerProbability = triggerProbability;
        w.chargeAttackSpeed = chargeAttackSpeed;
        w.fallAttackSpeed = fallAttackSpeed;
        w.multiShot = multiShot;
        w.maxAmmo = maxAmmo;
        w.ammoConversionRate = ammoConversionRate;
        w.passiveStat = passiveStat;
        w.passiveValue = passiveValue;
        w.activeSkillDescription = activeSkillDescription;
        return w;
    }

    // ===== 수정 =====
    public void update(
            String slug, String name, String image,
            String category, String weaponType, String attackType, String element,
            BigDecimal attack, BigDecimal critRate, BigDecimal critDamage,
            BigDecimal attackSpeed, BigDecimal triggerProbability,
            BigDecimal chargeAttackSpeed, BigDecimal fallAttackSpeed,
            Integer multiShot, Integer maxAmmo, BigDecimal ammoConversionRate,
            String passiveStat, BigDecimal passiveValue, String activeSkillDescription) {
        this.slug = slug;
        this.name = name;
        this.image = image;
        this.category = category;
        this.weaponType = weaponType;
        this.attackType = attackType;
        this.element = element;
        this.attack = attack;
        this.critRate = critRate;
        this.critDamage = critDamage;
        this.attackSpeed = attackSpeed;
        this.triggerProbability = triggerProbability;
        this.chargeAttackSpeed = chargeAttackSpeed;
        this.fallAttackSpeed = fallAttackSpeed;
        this.multiShot = multiShot;
        this.maxAmmo = maxAmmo;
        this.ammoConversionRate = ammoConversionRate;
        this.passiveStat = passiveStat;
        this.passiveValue = passiveValue;
        this.activeSkillDescription = activeSkillDescription;
    }
}
