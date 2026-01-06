package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class PassiveUpgradeResponse {

    private final String upgradeKey;
    private final String targetStat;
    private final BigDecimal value;

    public PassiveUpgradeResponse(
            String upgradeKey,
            String targetStat,
            BigDecimal value) {
        this.upgradeKey = upgradeKey;
        this.targetStat = targetStat;
        this.value = value;
    }

}
