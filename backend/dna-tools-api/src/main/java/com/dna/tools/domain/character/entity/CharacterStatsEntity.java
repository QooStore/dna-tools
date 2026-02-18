package com.dna.tools.domain.character.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    private BigDecimal attack;

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

    public CharacterStatsEntity(
            CharacterEntity character,
            BigDecimal attack,
            int hp,
            int defense,
            int maxMentality,
            BigDecimal resolve,
            BigDecimal morale) {
        this.character = character;
        this.attack = attack;
        this.hp = hp;
        this.defense = defense;
        this.maxMentality = maxMentality;
        this.resolve = resolve;
        this.morale = morale;
    }

    public void update(
            BigDecimal attack,
            int hp,
            int defense,
            int maxMentality,
            BigDecimal resolve,
            BigDecimal morale) {
        this.attack = attack;
        this.hp = hp;
        this.defense = defense;
        this.maxMentality = maxMentality;
        this.resolve = resolve;
        this.morale = morale;
    }

}
