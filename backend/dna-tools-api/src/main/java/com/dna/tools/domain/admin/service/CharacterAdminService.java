package com.dna.tools.domain.admin.service;

import com.dna.tools.domain.admin.dto.CharacterSaveRequest;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.entity.CharacterStatsEntity;
import com.dna.tools.domain.character.entity.ConsonanceWeaponEntity;
import com.dna.tools.domain.character.repository.CharacterRepository;
import com.dna.tools.domain.image.service.ImageUsageService;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CharacterAdminService {

    private final CharacterRepository characterRepository;
    private final ImageUsageService imageUsageService;

    /*
     * =====================
     * CREATE
     * =====================
     */
    @Transactional
    public void create(CharacterSaveRequest req) {

        CharacterEntity character = CharacterEntity.create(
                req.getSlug(),
                req.getName(),
                req.getElementCode(),
                imageUsageService.extractFilename(req.getImage()),
                req.getElementImage(),
                imageUsageService.extractFilename(req.getListImage()),
                req.getMeleeProficiency(),
                req.getRangedProficiency());

        try {
            characterRepository.save(character);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.CHARACTER_SLUG_DUPLICATE);
        }

        // 1:1
        if (req.getStats() != null) {
            var s = req.getStats();
            character.setStats(new CharacterStatsEntity(
                    character,
                    s.getAttack(),
                    s.getHp(),
                    s.getDefense(),
                    s.getMaxMentality(),
                    s.getResolve(),
                    s.getMorale()));
        }

        if (req.getConsonanceWeapon() != null) {
            var w = req.getConsonanceWeapon();
            character.setConsonanceWeapon(new ConsonanceWeaponEntity(
                    character,
                    w.getCategory(),
                    w.getWeaponType(),
                    w.getAttackType(),
                    w.getAttack(),
                    w.getCritRate(),
                    w.getCritDamage(),
                    w.getAttackSpeed(),
                    w.getTriggerProbability()));
        }

        // 1:N
        if (req.getFeatures() != null) {
            req.getFeatures().forEach(f -> character.addFeature(f.getFeatureCode()));
        }

        if (req.getSkills() != null) {
            req.getSkills().forEach(s -> character.addSkill(s.getName(), s.getType(), s.getDescription()));
        }

        if (req.getIntrons() != null) {
            req.getIntrons().stream()
                    .filter(i -> i.getDescription() != null && !i.getDescription().isBlank())
                    .forEach(i -> character.addIntron(i.getStage(), i.getDescription()));
        }

        if (req.getPassiveUpgrades() != null) {
            req.getPassiveUpgrades().forEach(p -> character.addPassiveUpgrade(
                    p.getUpgradeKey(),
                    p.getUpgradeType(),
                    p.getTargetStat(),
                    p.getValue(),
                    p.getName(),
                    p.getDescription()));
        }

        imageUsageService.markUsed(
                character.getImage(),
                character.getListImage());

    }

    /*
     * =====================
     * UPDATE
     * =====================
     */
    @Transactional
    public void updateBySlug(String slug, CharacterSaveRequest req) {

        CharacterEntity character = characterRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHARACTER_NOT_FOUND));

        // slug 변경 시 중복 체크
        if (!character.getSlug().equals(req.getSlug())
                && characterRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BusinessException(ErrorCode.CHARACTER_SLUG_DUPLICATE);
        }

        // 이미지 변경 감지를 위해 updateBasic 전에 이전 값 캡처
        String prevImage = character.getImage();
        String prevListImage = character.getListImage();

        // 1) 기본 정보 (이미지는 filename으로 변환하여 저장)
        character.updateBasic(
                req.getSlug(),
                req.getName(),
                req.getElementCode(),
                imageUsageService.extractFilename(req.getImage()),
                req.getElementImage(),
                imageUsageService.extractFilename(req.getListImage()),
                req.getMeleeProficiency(),
                req.getRangedProficiency());

        // 2) 1:N 전량 교체
        character.clearFeatures();
        if (req.getFeatures() != null) {
            req.getFeatures().forEach(f -> character.addFeature(f.getFeatureCode()));
        }

        character.clearSkills();
        if (req.getSkills() != null) {
            req.getSkills().forEach(s -> character.addSkill(s.getName(), s.getType(), s.getDescription()));
        }

        character.clearIntrons();
        if (req.getIntrons() != null) {
            req.getIntrons().stream()
                    .filter(i -> i.getDescription() != null && !i.getDescription().isBlank())
                    .forEach(i -> character.addIntron(i.getStage(), i.getDescription()));
        }

        if (req.getPassiveUpgrades() != null) {
            character.syncPassiveUpgrades(req.getPassiveUpgrades());
        }

        // 3) 1:1 교체
        var s = req.getStats();
        if (s != null) {
            if (character.getStats() == null) {
                character.setStats(new CharacterStatsEntity(
                        character,
                        s.getAttack(),
                        s.getHp(),
                        s.getDefense(),
                        s.getMaxMentality(),
                        s.getResolve(),
                        s.getMorale()));
            } else {
                character.getStats().update(
                        s.getAttack(),
                        s.getHp(),
                        s.getDefense(),
                        s.getMaxMentality(),
                        s.getResolve(),
                        s.getMorale());
            }
        }

        var w = req.getConsonanceWeapon();
        if (w != null) {
            if (character.getConsonanceWeapon() == null) {
                character.setConsonanceWeapon(new ConsonanceWeaponEntity(
                        character,
                        w.getCategory(),
                        w.getWeaponType(),
                        w.getAttackType(),
                        w.getAttack(),
                        w.getCritRate(),
                        w.getCritDamage(),
                        w.getAttackSpeed(),
                        w.getTriggerProbability()));
            } else {
                character.getConsonanceWeapon().update(
                        w.getCategory(),
                        w.getWeaponType(),
                        w.getAttackType(),
                        w.getAttack(),
                        w.getCritRate(),
                        w.getCritDamage(),
                        w.getAttackSpeed(),
                        w.getTriggerProbability());
            }
        }

        // 이미지 메타데이터 갱신
        imageUsageService.markUsed(character.getImage(), character.getListImage());
        imageUsageService.unmarkIfChanged(prevImage, character.getImage());
        imageUsageService.unmarkIfChanged(prevListImage, character.getListImage());

    }

    @Transactional
    public void deleteCharacter(long id) {

        CharacterEntity character = characterRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHARACTER_NOT_FOUND));

        imageUsageService.markUnused(
                character.getImage(),
                character.getListImage());

        characterRepository.deleteById(id);
    }
}
