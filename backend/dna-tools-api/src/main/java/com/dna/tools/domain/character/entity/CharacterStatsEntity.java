package com.dna.tools.domain.character.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "character_stats")
public class CharacterStatsEntity {

    /** PK = FK */
    @Id
    @Column(name = "character_id")
    private Long characterId;

    /** 연관관계 (PK 공유, MapsId설정) */
    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id")
    private CharacterEntity character;

    @Column(nullable = false)
    private int attack;

    @Column(nullable = false)
    private int hp;

    @Column(nullable = false)
    private int defense;

    @Column(name = "max_mentality", nullable = false)
    private int maxMentality;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal resolve;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal morale;

    protected CharacterStatsEntity() {
    }

    public CharacterStatsEntity(
            CharacterEntity character,
            int attack,
            int hp,
            int defense,
            int maxMentality,
            BigDecimal resolve,
            BigDecimal morale) {
        this.character = character;
        this.characterId = character.getId(); // PK 공유
        this.attack = attack;
        this.hp = hp;
        this.defense = defense;
        this.maxMentality = maxMentality;
        this.resolve = resolve;
        this.morale = morale;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public CharacterEntity getCharacter() {
        return character;
    }

    public int getAttack() {
        return attack;
    }

    public int getHp() {
        return hp;
    }

    public int getDefense() {
        return defense;
    }

    public int getMaxMentality() {
        return maxMentality;
    }

    public BigDecimal getResolve() {
        return resolve;
    }

    public BigDecimal getMorale() {
        return morale;
    }
}
