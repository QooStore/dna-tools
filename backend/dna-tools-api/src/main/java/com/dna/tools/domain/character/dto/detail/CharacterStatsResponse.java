package com.dna.tools.domain.character.dto.detail;

public class CharacterStatsResponse {

    private final int hp;
    private final int attack;
    private final int defense;

    public CharacterStatsResponse(int hp, int attack, int defense) {
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
    }

    public int getHp() {
        return hp;
    }

    public int getAttack() {
        return attack;
    }

    public int getDefense() {
        return defense;
    }
}
