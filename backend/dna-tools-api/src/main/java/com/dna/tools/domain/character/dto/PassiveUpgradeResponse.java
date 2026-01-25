package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class PassiveUpgradeResponse {

    private final String upgradeKey;
    private final String upgradeType;
    private final String targetStat;
    private final BigDecimal value;
    private final String name;
    private final String description;

    public PassiveUpgradeResponse(String upgradeKey, String upgradeType, String targetStat, BigDecimal value,
            String name, String description) {
        this.upgradeKey = upgradeKey;
        this.upgradeType = upgradeType;
        this.targetStat = targetStat;
        this.value = value;
        this.name = name;
        this.description = description;
    }

}
