package com.dna.tools.domain.character.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class CharacterStatsResponse {

    private final int hp;
    private final int attack;
    private final int defense;
    private final int maxMentality;
    private final BigDecimal resolve;
    private final BigDecimal morale;

    public CharacterStatsResponse(int hp, int attack, int defense, int maxMentality, BigDecimal resolve,
            BigDecimal morale) {
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.maxMentality = maxMentality;
        this.resolve = resolve;
        this.morale = morale;
    }

}
