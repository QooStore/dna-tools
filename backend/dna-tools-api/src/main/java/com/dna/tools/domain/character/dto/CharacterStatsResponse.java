package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class CharacterStatsResponse {

    private final BigDecimal attack;
    private final int hp;
    private final int defense;
    private final int maxMentality;
    private final BigDecimal resolve;
    private final BigDecimal morale;

    public CharacterStatsResponse(BigDecimal attack, int hp, int defense, int maxMentality, BigDecimal resolve,
            BigDecimal morale) {
        this.attack = attack;
        this.hp = hp;
        this.defense = defense;
        this.maxMentality = maxMentality;
        this.resolve = resolve;
        this.morale = morale;
    }

}
