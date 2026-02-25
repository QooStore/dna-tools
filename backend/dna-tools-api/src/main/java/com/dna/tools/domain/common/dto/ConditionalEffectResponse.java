package com.dna.tools.domain.common.dto;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class ConditionalEffectResponse {

    private final Long id;
    private final String sourceType;   // 캐릭터 전용: SKILL / PASSIVE / INTRON (무기/쐐기는 null)
    private final Integer intronStage; // INTRON일 때만 사용, 나머지는 null
    private final String statType;
    private final BigDecimal value;

    public ConditionalEffectResponse(Long id, String sourceType, Integer intronStage,
            String statType, BigDecimal value) {
        this.id = id;
        this.sourceType = sourceType;
        this.intronStage = intronStage;
        this.statType = statType;
        this.value = value;
    }
}
