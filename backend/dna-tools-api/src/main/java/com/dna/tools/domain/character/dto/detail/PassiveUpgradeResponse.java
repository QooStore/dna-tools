package com.dna.tools.domain.character.dto.detail;

import java.math.BigDecimal;

public class PassiveUpgradeResponse {

    private final String upgradeType;
    private final String targetStat;
    private final BigDecimal value;

    public PassiveUpgradeResponse(
            String upgradeType,
            String targetStat,
            BigDecimal value) {
        this.upgradeType = upgradeType;
        this.targetStat = targetStat;
        this.value = value;
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
}
