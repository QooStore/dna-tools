package com.dna.tools.domain.admin.dto;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class DemonWedgeSaveRequest {

    private String slug;
    private String name;
    private String image;
    private Integer rarity;
    private Integer resistance;
    private String tendency;
    private String equipType;
    private String element;
    private Boolean isKukulkan;
    private String effectDescription;
    private List<StatRequest> stats;
    private List<ConditionalEffect> conditionalEffects;

    @Getter
    public static class StatRequest {
        private String statType;
        private BigDecimal value;
    }

    @Getter
    public static class ConditionalEffect {
        private String statType;
        private BigDecimal value;
    }
}
