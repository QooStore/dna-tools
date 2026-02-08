package com.dna.tools.domain.weapon.service;

import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.common.service.CommonCodeLabelService;
import com.dna.tools.domain.image.storage.ImageStorage;
import com.dna.tools.domain.weapon.dto.WeaponDetailResponse;
import com.dna.tools.domain.weapon.dto.WeaponListResponse;
import com.dna.tools.domain.weapon.entity.WeaponEntity;
import com.dna.tools.domain.weapon.repository.WeaponRepository;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeaponService {

        private final WeaponRepository weaponRepository;
        private final CommonCodeLabelService commonCodeLabelService;
        private final ImageStorage imageStorage;

        public List<WeaponListResponse> getAllWeapons() {
                List<WeaponEntity> weapons = weaponRepository.findAllByOrderByIdAsc();

                LabelContext labels = commonCodeLabelService.getLabelContext(List.of(
                                "ELEMENT",
                                "MELEEWEAPON",
                                "RANGEDWEAPON",
                                "ATTACK_TYPE",
                                "WEAPON_PASSIVE_STAT",
                                "WORD"));

                return weapons.stream()
                                .map(w -> toListResponse(w, labels))
                                .toList();
        }

        public WeaponDetailResponse getWeaponBySlug(String slug) {
                WeaponEntity w = weaponRepository.findBySlug(slug)
                                .orElseThrow(() -> new BusinessException(ErrorCode.WEAPON_NOT_FOUND));

                return WeaponDetailResponse.builder()
                                .id(w.getId())
                                .slug(w.getSlug())
                                .name(w.getName())
                                .image(w.getImage() != null ? imageStorage.getUrl(w.getImage()) : null)
                                .category(w.getCategory())
                                .weaponType(w.getWeaponType())
                                .attackType(w.getAttackType())
                                .element(w.getElement())
                                .attack(w.getAttack())
                                .critRate(w.getCritRate())
                                .critDamage(w.getCritDamage())
                                .attackSpeed(w.getAttackSpeed())
                                .triggerProbability(w.getTriggerProbability())
                                .chargeAttackSpeed(w.getChargeAttackSpeed())
                                .fallAttackSpeed(w.getFallAttackSpeed())
                                .multiShot(w.getMultiShot())
                                .maxAmmo(w.getMaxAmmo())
                                .ammoConversionRate(w.getAmmoConversionRate())
                                .passiveStat(w.getPassiveStat())
                                .passiveValue(w.getPassiveValue())
                                .activeSkillDescription(w.getActiveSkillDescription())
                                .build();
        }

        private WeaponListResponse toListResponse(WeaponEntity w, LabelContext labels) {
                // 무기 타입 라벨: category에 따라 MELEEWEAPON 또는 RANGEDWEAPON에서 조회
                String weaponTypeCodeType = "melee".equals(w.getCategory()) ? "MELEEWEAPON" : "RANGEDWEAPON";

                return WeaponListResponse.builder()
                                .id(w.getId())
                                .slug(w.getSlug())
                                .name(w.getName())
                                .image(w.getImage() != null ? imageStorage.getUrl(w.getImage()) : null)
                                .category(w.getCategory())
                                .categoryLabel("melee".equals(w.getCategory()) ? "근거리" : "원거리")
                                .weaponType(w.getWeaponType())
                                .weaponTypeLabel(labels.label(weaponTypeCodeType, w.getWeaponType()))
                                .attackType(w.getAttackType())
                                .attackTypeLabel(labels.label("ATTACK_TYPE", w.getAttackType()))
                                .element(w.getElement())
                                .elementLabel(labels.label("ELEMENT", w.getElement()))
                                .attack(w.getAttack())
                                .critRate(w.getCritRate())
                                .critDamage(w.getCritDamage())
                                .attackSpeed(w.getAttackSpeed())
                                .triggerProbability(w.getTriggerProbability())
                                .chargeAttackSpeed(w.getChargeAttackSpeed())
                                .fallAttackSpeed(w.getFallAttackSpeed())
                                .multiShot(w.getMultiShot())
                                .maxAmmo(w.getMaxAmmo())
                                .ammoConversionRate(w.getAmmoConversionRate())
                                .passiveStat(w.getPassiveStat())
                                .passiveStatLabel(labels.label("STAT", w.getPassiveStat()))
                                .passiveValue(w.getPassiveValue())
                                .activeSkillDescription(w.getActiveSkillDescription())
                                .build();
        }
}
