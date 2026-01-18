package com.dna.tools.domain.character.mapper;

import com.dna.tools.domain.character.dto.*;
import com.dna.tools.domain.character.entity.*;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CharacterDetailMapper {

        public static CharacterDetailResponse toResponse(CharacterEntity character) {

                return new CharacterDetailResponse(
                                character.getName(),
                                character.getSlug(),
                                character.getElement(),
                                character.getImage(),
                                character.getListImage(),
                                character.getElementImage(),
                                character.getMeleeProficiency(),
                                character.getRangedProficiency(),
                                toStats(character.getStats()),
                                toConsonanceWeapon(character.getConsonanceWeapon()),
                                toFeatures(character.getFeatures()),
                                toSkills(character.getSkills()),
                                toIntrons(character.getIntrons()),
                                toPassiveUpgrades(character.getPassiveUpgrades()));
        }

        private static CharacterStatsResponse toStats(CharacterStatsEntity stats) {
                return new CharacterStatsResponse(
                                stats.getHp(),
                                stats.getAttack(),
                                stats.getDefense(),
                                stats.getMaxMentality(),
                                stats.getResolve(),
                                stats.getMorale());
        }

        private static ConsonanceWeaponResponse toConsonanceWeapon(
                        ConsonanceWeaponEntity weapon) {
                if (weapon == null) {
                        return null;
                }

                return new ConsonanceWeaponResponse(
                                weapon.getCategory(),
                                weapon.getWeaponType(),
                                weapon.getAttackType(),
                                weapon.getAttack(),
                                weapon.getCritRate(),
                                weapon.getCritDamage(),
                                weapon.getAttackSpeed(),
                                weapon.getTriggerProbability());
        }

        private static List<CharacterFeatureResponse> toFeatures(
                        Set<CharacterFeatureEntity> features) {
                return features.stream()
                                .map(f -> new CharacterFeatureResponse(
                                                f.getFeature()))
                                .collect(Collectors.toList());
        }

        private static List<SkillResponse> toSkills(
                        Set<SkillEntity> skills) {
                return skills.stream()
                                .map(s -> new SkillResponse(
                                                s.getName(),
                                                s.getType(),
                                                s.getDescription()))
                                .collect(Collectors.toList());
        }

        private static List<IntronResponse> toIntrons(
                        Set<IntronEntity> introns) {
                return introns.stream()
                                .map(i -> new IntronResponse(
                                                i.getStage(),
                                                i.getDescription()))
                                .collect(Collectors.toList());
        }

        private static List<PassiveUpgradeResponse> toPassiveUpgrades(
                        Set<PassiveUpgradeEntity> upgrades) {
                return upgrades.stream()
                                .map(p -> new PassiveUpgradeResponse(
                                                p.getUpgradeKey(),
                                                p.getName(),
                                                p.getDescription()))
                                .collect(Collectors.toList());
        }
}
