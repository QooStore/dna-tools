package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class ConsonanceWeaponResponse {

    private final String category;
    private final String weaponType;
    private final String attackType;
    private final BigDecimal attack;
    private final BigDecimal critRate;
    private final BigDecimal critDamage;
    private final BigDecimal attackSpeed;
    private final BigDecimal triggerProbability;

    public ConsonanceWeaponResponse(String category, String weaponType, String attackType, BigDecimal attack,
            BigDecimal critRate, BigDecimal critDamage, BigDecimal attackSpeed, BigDecimal triggerProbability) {
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
