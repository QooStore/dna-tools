package com.dna.tools.domain.character.dto.detail;

import java.util.List;

public class CharacterDetailResponse {

    private final String name;
    private final String slug;

    private final CharacterStatsResponse stats;
    private final ConsonanceWeaponResponse consonanceWeapon;

    private final List<CharacterFeatureResponse> features;
    private final List<SkillResponse> skills;
    private final List<IntronResponse> introns;
    private final List<PassiveUpgradeResponse> passiveUpgrades;

    public CharacterDetailResponse(
            String name,
            String slug,
            CharacterStatsResponse stats,
            ConsonanceWeaponResponse consonanceWeapon,
            List<CharacterFeatureResponse> features,
            List<SkillResponse> skills,
            List<IntronResponse> introns,
            List<PassiveUpgradeResponse> passiveUpgrades) {
        this.name = name;
        this.slug = slug;
        this.stats = stats;
        this.consonanceWeapon = consonanceWeapon;
        this.features = features;
        this.skills = skills;
        this.introns = introns;
        this.passiveUpgrades = passiveUpgrades;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public CharacterStatsResponse getStats() {
        return stats;
    }

    public ConsonanceWeaponResponse getConsonanceWeapon() {
        return consonanceWeapon;
    }

    public List<CharacterFeatureResponse> getFeatures() {
        return features;
    }

    public List<SkillResponse> getSkills() {
        return skills;
    }

    public List<IntronResponse> getIntrons() {
        return introns;
    }

    public List<PassiveUpgradeResponse> getPassiveUpgrades() {
        return passiveUpgrades;
    }
}
