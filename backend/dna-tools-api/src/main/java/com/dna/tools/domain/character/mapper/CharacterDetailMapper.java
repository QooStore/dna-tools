package com.dna.tools.domain.character.mapper;

import com.dna.tools.domain.character.dto.*;
import com.dna.tools.domain.character.entity.*;
import com.dna.tools.domain.common.dto.ConditionalEffectResponse;
import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.image.storage.ImageStorage;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CharacterDetailMapper {

        private final ImageStorage imageStorage;

        public CharacterDetailResponse toResponse(CharacterEntity character,
                        LabelContext labels) {

                return new CharacterDetailResponse(
                                character.getSlug(),
                                character.getName(),
                                character.getElement(),
                                labels.label("ELEMENT", character.getElement()),
                                imageStorage.getUrl(character.getImage()),
                                character.getElementImage(),
                                imageStorage.getUrl(character.getListImage()),
                                character.getMeleeProficiency(),
                                labels.label("MELEEWEAPON", character.getMeleeProficiency()),
                                character.getRangedProficiency(),
                                labels.label("RANGEDWEAPON", character.getRangedProficiency()),
                                toStats(character.getStats()),
                                toConsonanceWeapon(character.getConsonanceWeapon(), labels),
                                toFeatures(character.getFeatures(), labels),
                                toSkills(character.getSkills(), labels),
                                toIntrons(character.getIntrons()),
                                toPassiveUpgrades(character.getPassiveUpgrades()),
                                toConditionalEffects(character.getConditionalEffects()));
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
                // 무기 타입 라벨: category에 따라 MELEEWEAPON 또는 RANGEDWEAPON에서 조회
                String weaponTypeCodeType = "melee".equals(weapon.getCategory()) ? "MELEEWEAPON" : "RANGEDWEAPON";

                return new ConsonanceWeaponResponse(
                                weapon.getCategory(),
                                labels.label("CATEGORY", weapon.getCategory()),
                                weapon.getWeaponType(),
                                labels.label(weaponTypeCodeType, weapon.getWeaponType()),
                                weapon.getAttackType(),
                                labels.label("ATTACK_TYPE", weapon.getAttackType()),
                                weapon.getAttack(),
                                weapon.getCritRate(),
                                weapon.getCritDamage(),
                                weapon.getAttackSpeed(),
                                weapon.getTriggerProbability(),
                                weapon.getMultishot());
        }

        private static List<CharacterFeatureResponse> toFeatures(
                        List<CharacterFeatureEntity> features, LabelContext labels) {
                return features.stream()
                                .map(f -> new CharacterFeatureResponse(
                                                f.getFeature(),
                                                labels.label("FEATURE", f.getFeature())))
                                .toList();
        }

        private static List<SkillResponse> toSkills(
                        List<SkillEntity> skills, LabelContext labels) {
                return skills.stream()
                                .map(s -> new SkillResponse(
                                                s.getName(),
                                                s.getType(),
                                                labels.label("SKILL_TYPE", s.getType()),
                                                s.getDescription()))
                                .toList();
        }

        private static List<IntronResponse> toIntrons(
                        List<IntronEntity> introns) {
                return introns.stream()
                                .map(i -> new IntronResponse(
                                                i.getStage(),
                                                i.getDescription()))
                                .toList();
        }

        private static List<ConditionalEffectResponse> toConditionalEffects(
                        List<CharacterConditionalEffectEntity> effects) {
                return effects.stream()
                                .map(e -> new ConditionalEffectResponse(
                                                e.getId(),
                                                e.getSourceType(),
                                                e.getIntronStage(),
                                                e.getStatType(),
                                                e.getValue()))
                                .toList();
        }

        private static List<PassiveUpgradeResponse> toPassiveUpgrades(
                        List<PassiveUpgradeEntity> upgrades) {
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
