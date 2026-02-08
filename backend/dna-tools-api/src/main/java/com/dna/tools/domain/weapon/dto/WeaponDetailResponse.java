package com.dna.tools.domain.weapon.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class WeaponDetailResponse {

    private final Long id;
    private final String slug;
    private final String name;
    private final String image;

    // 분류
    private final String category;
    private final String weaponType;
    private final String attackType;
    private final String element;

    // 공통 스탯
    private final BigDecimal attack;
    private final BigDecimal critRate;
    private final BigDecimal critDamage;
    private final BigDecimal attackSpeed;
    private final BigDecimal triggerProbability;

    // 근접 전용
    private final BigDecimal chargeAttackSpeed;
    private final BigDecimal fallAttackSpeed;

    // 원거리 전용
    private final Integer multiShot;
    private final Integer maxAmmo;
    private final BigDecimal ammoConversionRate;

    // 패시브 스킬
    private final String passiveStat;
    private final BigDecimal passiveValue;

    // 액티브 스킬
    private final String activeSkillDescription;
}
