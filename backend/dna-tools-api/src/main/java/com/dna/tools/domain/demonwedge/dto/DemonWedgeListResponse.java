package com.dna.tools.domain.demonwedge.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

import com.dna.tools.domain.common.dto.ConditionalEffectResponse;

@Getter
@Builder
public class DemonWedgeListResponse {

    private final Long id;
    private final String slug;
    private final String name;
    private final String image;
    private final Integer rarity;
    private final Integer resistance;
    private final String tendency;
    private final String tendencyLabel;
    private final String equipType;
    private final String equipTypeLabel;
    private final String element;
    private final String elementLabel;
    private final Boolean isKukulkan;
    private final String effectDescription;
    private final List<StatResponse> stats;
    private final List<ConditionalEffectResponse> conditionalEffects;

    @Getter
    @Builder
    public static class StatResponse {
        private final String statType;
        private final String statTypeLabel;
        private final BigDecimal value;
    }
}
