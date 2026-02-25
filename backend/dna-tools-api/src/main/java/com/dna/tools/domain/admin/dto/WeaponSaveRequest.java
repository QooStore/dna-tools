package com.dna.tools.domain.admin.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;

@Getter
public class WeaponSaveRequest {

    private String slug;
    private String name;
    private String image;

    // 분류
    private String category;
    private String weaponType;
    private String attackType;
    private String element;

    // 공통 스탯
    private BigDecimal attack;
    private BigDecimal critRate;
    private BigDecimal critDamage;
    private BigDecimal attackSpeed;
    private BigDecimal triggerProbability;

    // 근접 전용
    private BigDecimal chargeAttackSpeed;
    private BigDecimal fallAttackSpeed;

    // 원거리 전용
    private Integer multishot;
    private Integer maxAmmo;
    private Integer magCapacity;
    private BigDecimal ammoConversionRate;

    // 패시브 스킬
    private String passiveStat;
    private BigDecimal passiveValue;

    // 액티브 스킬
    private String activeSkillDescription;

    // 조건부 효과
    private List<ConditionalEffect> conditionalEffects;

    @Getter
    public static class ConditionalEffect {
        private String statType;
        private BigDecimal value;
    }
}
