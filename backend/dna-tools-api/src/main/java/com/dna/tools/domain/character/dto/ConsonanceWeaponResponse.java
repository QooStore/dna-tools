package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class ConsonanceWeaponResponse {

    private final String category;
    private final String categoryLabel;
    private final String weaponType;
    private final String weaponTypeLabel;
    private final String attackType;
    private final String attackTypeLabel;
    private final BigDecimal attack;
    private final BigDecimal critRate;
    private final BigDecimal critDamage;
    private final BigDecimal attackSpeed;
    private final BigDecimal triggerProbability;
    private final BigDecimal multishot;

    public ConsonanceWeaponResponse(String category, String categoryLabel, String weaponType, String weaponTypeLabel,
            String attackType, String attackTypeLabel, BigDecimal attack,
            BigDecimal critRate, BigDecimal critDamage, BigDecimal attackSpeed, BigDecimal triggerProbability,
            BigDecimal multishot) {
        this.category = category;
        this.categoryLabel = categoryLabel;
        this.weaponType = weaponType;
        this.weaponTypeLabel = weaponTypeLabel;
        this.attackType = attackType;
        this.attackTypeLabel = attackTypeLabel;
        this.attack = attack;
        this.critRate = critRate;
        this.critDamage = critDamage;
        this.attackSpeed = attackSpeed;
        this.triggerProbability = triggerProbability;
        this.multishot = multishot;
    }
}
