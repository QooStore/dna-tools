package com.dna.tools.domain.admin.service;

import com.dna.tools.domain.admin.dto.WeaponSaveRequest;
import com.dna.tools.domain.image.service.ImageUsageService;
import com.dna.tools.domain.weapon.entity.WeaponEntity;
import com.dna.tools.domain.weapon.repository.WeaponRepository;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WeaponAdminService {

    private final WeaponRepository weaponRepository;
    private final ImageUsageService imageUsageService;

    @Transactional
    public void create(WeaponSaveRequest req) {

        WeaponEntity weapon = WeaponEntity.create(
                req.getSlug(),
                req.getName(),
                imageUsageService.extractFilename(req.getImage()),
                req.getCategory(),
                req.getWeaponType(),
                req.getAttackType(),
                req.getElement(),
                req.getAttack(),
                req.getCritRate(),
                req.getCritDamage(),
                req.getAttackSpeed(),
                req.getTriggerProbability(),
                req.getChargeAttackSpeed(),
                req.getFallAttackSpeed(),
                req.getMultishot(),
                req.getMaxAmmo(),
                req.getMagCapacity(),
                req.getAmmoConversionRate(),
                req.getPassiveStat(),
                req.getPassiveValue(),
                req.getActiveSkillDescription());

        if (req.getConditionalEffects() != null) {
            req.getConditionalEffects().forEach(e -> weapon.addConditionalEffect(
                    e.getStatType(), e.getValue()));
        }

        try {
            weaponRepository.save(weapon);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.WEAPON_SLUG_DUPLICATE);
        }

        imageUsageService.markUsed(weapon.getImage());
    }

    @Transactional
    public void updateBySlug(String slug, WeaponSaveRequest req) {

        WeaponEntity weapon = weaponRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessException(ErrorCode.WEAPON_NOT_FOUND));

        // slug 변경 시 중복 체크
        if (!weapon.getSlug().equals(req.getSlug())
                && weaponRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BusinessException(ErrorCode.WEAPON_SLUG_DUPLICATE);
        }

        String prevImage = weapon.getImage();

        weapon.update(
                req.getSlug(),
                req.getName(),
                imageUsageService.extractFilename(req.getImage()),
                req.getCategory(),
                req.getWeaponType(),
                req.getAttackType(),
                req.getElement(),
                req.getAttack(),
                req.getCritRate(),
                req.getCritDamage(),
                req.getAttackSpeed(),
                req.getTriggerProbability(),
                req.getChargeAttackSpeed(),
                req.getFallAttackSpeed(),
                req.getMultishot(),
                req.getMaxAmmo(),
                req.getMagCapacity(),
                req.getAmmoConversionRate(),
                req.getPassiveStat(),
                req.getPassiveValue(),
                req.getActiveSkillDescription());

        weapon.clearConditionalEffects();
        if (req.getConditionalEffects() != null) {
            req.getConditionalEffects().forEach(e -> weapon.addConditionalEffect(
                    e.getStatType(), e.getValue()));
        }

        // 이미지 메타데이터 갱신
        imageUsageService.markUsed(weapon.getImage());
        imageUsageService.unmarkIfChanged(prevImage, weapon.getImage());
    }

    @Transactional
    public void deleteWeapon(long id) {

        WeaponEntity weapon = weaponRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.WEAPON_NOT_FOUND));

        imageUsageService.markUnused(weapon.getImage());

        weaponRepository.deleteById(id);
    }
}
