package com.dna.tools.domain.admin.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;

@Getter
public class CharacterSaveRequest {

    // characters
    private String slug;
    private String name;
    private String elementCode;
    private String image;
    private String elementImage;
    private String listImage;
    private String meleeProficiency;
    private String rangedProficiency;

    // 1:1
    private Stats stats;
    private ConsonanceWeapon consonanceWeapon;

    // 1:N
    private List<Feature> features;
    private List<Skill> skills;
    private List<Intron> introns;
    private List<PassiveUpgrade> passiveUpgrades;

    @Getter
    public static class Feature {
        private String featureCode;
    }

    @Getter
    public static class Stats {
        private BigDecimal attack;
        private int hp;
        private int defense;
        private int maxMentality;
        private BigDecimal resolve;
        private BigDecimal morale;
    }

    @Getter
    public static class ConsonanceWeapon {
        private String category;
        private String weaponType;
        private String attackType;
        private BigDecimal attack;
        private BigDecimal critRate;
        private BigDecimal critDamage;
        private BigDecimal attackSpeed;
        private BigDecimal triggerProbability;
        private BigDecimal multishot;
    }

    @Getter
    public static class Skill {
        private String name;
        private String type;
        private String description;
    }

    @Getter
    public static class Intron {
        private int stage;
        private String description;
    }

    @Getter
    public static class PassiveUpgrade {
        private String upgradeKey;
        private String upgradeType; // STAT / ABILITY / COOP
        private String targetStat; // STAT/COOP에서 사용 (nullable)
        private BigDecimal value; // STAT/COOP에서 사용 (nullable)
        private String name;
        private String description;
    }
}
