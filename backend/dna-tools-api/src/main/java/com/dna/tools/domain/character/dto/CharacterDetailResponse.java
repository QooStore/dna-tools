package com.dna.tools.domain.character.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class CharacterDetailResponse {

    private final String slug;
    private final String name;
    private final String elementCode;
    private final String image;
    private final String elementImage;
    private final String listImage;
    private final String meleeProficiency;
    private final String rangedProficiency;
    private final CharacterStatsResponse stats;
    private final ConsonanceWeaponResponse consonanceWeapon;

    private final List<CharacterFeatureResponse> features;
    private final List<SkillResponse> skills;
    private final List<IntronResponse> introns;
    private final List<PassiveUpgradeResponse> passiveUpgrades;

    public CharacterDetailResponse(String slug, String name, String elementCode, String image, String elementImage,
            String listImage, String meleeProficiency, String rangedProficiency, CharacterStatsResponse stats,
            ConsonanceWeaponResponse consonanceWeapon, List<CharacterFeatureResponse> features,
            List<SkillResponse> skills, List<IntronResponse> introns, List<PassiveUpgradeResponse> passiveUpgrades) {
        this.name = name;
        this.slug = slug;
        this.elementCode = elementCode;
        this.image = image;
        this.elementImage = elementImage;
        this.listImage = listImage;
        this.meleeProficiency = meleeProficiency;
        this.rangedProficiency = rangedProficiency;
        this.stats = stats;
        this.consonanceWeapon = consonanceWeapon;
        this.features = features;
        this.skills = skills;
        this.introns = introns;
        this.passiveUpgrades = passiveUpgrades;
    }

}
