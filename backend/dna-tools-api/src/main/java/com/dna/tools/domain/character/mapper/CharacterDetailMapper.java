package com.dna.tools.domain.character.mapper;

import com.dna.tools.domain.character.dto.*;
import com.dna.tools.domain.character.entity.*;
import com.dna.tools.domain.common.dto.LabelContext;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CharacterDetailMapper {

        public static CharacterDetailResponse toResponse(CharacterEntity character,
                        LabelContext labels) {

                return new CharacterDetailResponse(
                                character.getSlug(),
                                character.getName(),
                                character.getElement(),
                                labels.label("ELEMENT", character.getElement()),
                                character.getImage(),
                                character.getElementImage(),
                                character.getListImage(),
                                character.getMeleeProficiency(),
                                labels.label("MELEEWEAPON", character.getMeleeProficiency()),
                                character.getRangedProficiency(),
                                labels.label("RANGEDWEAPON", character.getRangedProficiency()),
                                toStats(character.getStats()),
                                toConsonanceWeapon(character.getConsonanceWeapon(), labels),
                                toFeatures(character.getFeatures(), labels),
                                toSkills(character.getSkills(), labels),
                                toIntrons(character.getIntrons()),
                                toPassiveUpgrades(character.getPassiveUpgrades()));
        }

        private static CharacterStatsResponse toStats(CharacterStatsEntity stats) {
                return new CharacterStatsResponse(
                                stats.getAttack(),
                                stats.getHp(),
                                stats.getDefense(),
                                stats.getMaxMentality(),
                                stats.getResolve(),
                                stats.getMorale());
        }

        private static ConsonanceWeaponResponse toConsonanceWeapon(
                        ConsonanceWeaponEntity weapon, LabelContext labels) {
                if (weapon == null)
                        return null;

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
                        Set<CharacterFeatureEntity> features, LabelContext labels) {
                return features.stream()
                                .map(f -> new CharacterFeatureResponse(
                                                f.getFeature(),
                                                labels.label("FEATURE", f.getFeature())))
                                .toList();
        }

        private static List<SkillResponse> toSkills(
                        Set<SkillEntity> skills, LabelContext labels) {
                return skills.stream()
                                .map(s -> new SkillResponse(
                                                s.getName(),
                                                s.getType(),
                                                labels.label("WORD", s.getType()),
                                                s.getDescription()))
                                .toList();
        }

        private static List<IntronResponse> toIntrons(
                        Set<IntronEntity> introns) {
                return introns.stream()
                                .map(i -> new IntronResponse(
                                                i.getStage(),
                                                i.getDescription()))
                                .toList();
        }

        private static List<PassiveUpgradeResponse> toPassiveUpgrades(
                        Set<PassiveUpgradeEntity> upgrades) {
                return upgrades.stream()
                                .map(p -> new PassiveUpgradeResponse(
                                                p.getUpgradeKey(),
                                                p.getUpgradeType(),
                                                p.getTargetStat(),
                                                p.getValue(),
                                                p.getName(),
                                                p.getDescription()))
                                .toList();
        }
}
