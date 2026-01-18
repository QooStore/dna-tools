package com.dna.tools.domain.admin.service;

import com.dna.tools.domain.admin.dto.CharacterSaveRequest;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.entity.CharacterStatsEntity;
import com.dna.tools.domain.character.entity.ConsonanceWeaponEntity;
import com.dna.tools.domain.character.repository.CharacterRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CharacterAdminService {

    private final CharacterRepository characterRepository;

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
                req.getImage(),
                req.getElementImage(),
                req.getListImage(),
                req.getMeleeProficiency(),
                req.getRangedProficiency());

        // 1) characters 먼저 저장 → ID 생성을 위해 saveAndFlush() 사용
        try {
            characterRepository.saveAndFlush(character); // insert는 flush 시점에 실행되기 때문에 일반 save() 대신 사용.
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("slug 중복 또는 제약조건 위반", e);
        }

        // 2) 1:1
        if (req.getStats() != null) {
            var s = req.getStats(); // var는 CharacterCreateRequest.Stats 대신 사용.
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

        // 3) 1:N
        if (req.getFeatures() != null) {
            req.getFeatures().forEach(f -> character.addFeature(f.getFeatureCode()));
        }

        if (req.getSkills() != null) {
            req.getSkills().forEach(s -> character.addSkill(s.getName(), s.getType(), s.getDescription()));
        }

        if (req.getIntrons() != null) {
            req.getIntrons().forEach(i -> character.addIntron(i.getStage(), i.getDescription()));
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

        characterRepository.flush();
    }

    /*
     * =====================
     * UPDATE
     * =====================
     */
    @Transactional
    public void update(Long id, CharacterSaveRequest req) {

        CharacterEntity character = characterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캐릭터 없음. id=" + id));

        // slug 변경 시 중복 체크
        if (!character.getSlug().equals(req.getSlug())
                && characterRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new IllegalArgumentException("slug 중복");
        }

        // 1) 기본 정보
        character.updateBasic(
                req.getSlug(),
                req.getName(),
                req.getElementCode(),
                req.getImage(),
                req.getElementImage(),
                req.getListImage(),
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
            req.getIntrons().forEach(i -> character.addIntron(i.getStage(), i.getDescription()));
        }

        character.clearPassiveUpgrades();
        if (req.getPassiveUpgrades() != null) {
            req.getPassiveUpgrades().forEach(p -> character.addPassiveUpgrade(
                    p.getUpgradeKey(),
                    p.getUpgradeType(),
                    p.getTargetStat(),
                    p.getValue(),
                    p.getName(),
                    p.getDescription()));
        }

        // 3) 1:1 교체
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

        characterRepository.flush();
    }

    public void deleteCharacter(Long id) {
        characterRepository.deleteById(id);
    }
}