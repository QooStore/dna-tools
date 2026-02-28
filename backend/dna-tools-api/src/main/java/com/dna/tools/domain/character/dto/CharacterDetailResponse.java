package com.dna.tools.domain.character.dto;

import java.util.List;

import com.dna.tools.domain.common.dto.ConditionalEffectResponse;
import lombok.Getter;

@Getter
public class CharacterDetailResponse {

    private final String slug;
    private final String name;
    private final String elementCode;
    private final String elementName;
    private final String image;
    private final String elementImage;
    private final String listImage;
    private final String meleeProficiency;
    private final String meleeProficiencyLabel;
    private final String rangedProficiency;
    private final String rangedProficiencyLabel;
    private final String itemCode;
    private final CharacterStatsResponse stats;
    private final ConsonanceWeaponResponse consonanceWeapon;

    private final List<CharacterFeatureResponse> features;
    private final List<SkillResponse> skills;
    private final List<IntronResponse> introns;
    private final List<PassiveUpgradeResponse> passiveUpgrades;
    private final List<ConditionalEffectResponse> conditionalEffects;

    public CharacterDetailResponse(String slug, String name, String elementCode, String elementName, String image,
            String elementImage,
            String listImage, String meleeProficiency, String meleeProficiencyLabel, String rangedProficiency,
            String rangedProficiencyLabel, String itemCode, CharacterStatsResponse stats,
            ConsonanceWeaponResponse consonanceWeapon, List<CharacterFeatureResponse> features,
            List<SkillResponse> skills, List<IntronResponse> introns, List<PassiveUpgradeResponse> passiveUpgrades,
            List<ConditionalEffectResponse> conditionalEffects) {
        this.name = name;
        this.slug = slug;
        this.elementCode = elementCode;
        this.elementName = elementName;
        this.image = image;
        this.elementImage = elementImage;
        this.listImage = listImage;
        this.meleeProficiency = meleeProficiency;
        this.meleeProficiencyLabel = meleeProficiencyLabel;
        this.rangedProficiency = rangedProficiency;
        this.rangedProficiencyLabel = rangedProficiencyLabel;
        this.itemCode = itemCode;
        this.stats = stats;
        this.consonanceWeapon = consonanceWeapon;
        this.features = features;
        this.skills = skills;
        this.introns = introns;
        this.passiveUpgrades = passiveUpgrades;
        this.conditionalEffects = conditionalEffects;
    }

}
