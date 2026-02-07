package com.dna.tools.domain.admin.service;

import com.dna.tools.domain.admin.dto.CharacterSaveRequest;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.entity.CharacterStatsEntity;
import com.dna.tools.domain.character.entity.ConsonanceWeaponEntity;
import com.dna.tools.domain.character.repository.CharacterRepository;
import com.dna.tools.domain.image.entity.UploadedImage;
import com.dna.tools.domain.image.repository.UploadedImageRepository;
import com.dna.tools.domain.image.storage.ImageStorage;
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
    private final UploadedImageRepository uploadedImageRepository;
    private final ImageStorage imageStorage;

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
                extractFilename(req.getImage()),
                req.getElementImage(),
                extractFilename(req.getListImage()),
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

        markImagesUsed(
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
        ImagePaths prevImages = captureImagePaths(character);

        // 1) 기본 정보 (이미지는 filename으로 변환하여 저장)
        character.updateBasic(
                req.getSlug(),
                req.getName(),
                req.getElementCode(),
                extractFilename(req.getImage()),
                req.getElementImage(),
                extractFilename(req.getListImage()),
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
        updateImageMetadata(character, prevImages);

    }

    @Transactional
    public void deleteCharacter(long id) {

        CharacterEntity character = characterRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHARACTER_NOT_FOUND));

        unmarkImages(
                character.getImage(),
                character.getListImage());

        characterRepository.deleteById(id);
    }

    // ==== Private Helper Methods ====

    /** URL에서 filename 추출. elementImage는 정적 경로이므로 대상이 아님 */
    private String extractFilename(String urlOrFilename) {
        return imageStorage.extractFilename(urlOrFilename);
    }

    private ImagePaths captureImagePaths(CharacterEntity character) {
        return new ImagePaths(
                character.getImage(),
                character.getListImage());
    }

    private void updateImageMetadata(CharacterEntity character, ImagePaths prevImages) {
        // 새 이미지 사용 확정
        markImagesUsed(character.getImage(), character.getListImage());

        // 이전 이미지 해제 (바뀐 경우만)
        unmarkIfChanged(prevImages.image, character.getImage());
        unmarkIfChanged(prevImages.listImage, character.getListImage());
    }

    private void markImagesUsed(String... filenames) {
        for (String filename : filenames) {
            if (filename == null || filename.isBlank())
                continue;

            uploadedImageRepository
                    .findByFilename(filename)
                    .ifPresent(UploadedImage::markUsed);
        }
    }

    private void unmarkImages(String... filenames) {
        for (String filename : filenames) {
            if (filename == null || filename.isBlank())
                continue;

            uploadedImageRepository.findByFilename(filename)
                    .ifPresent(UploadedImage::markUnused);
        }
    }

    private void unmarkIfChanged(String prev, String current) {
        if (prev == null || prev.isBlank())
            return;
        if (prev.equals(current))
            return;

        uploadedImageRepository.findByFilename(prev)
                .ifPresent(UploadedImage::markUnused);
    }

    // ===== 내부 클래스 =====
    private record ImagePaths(String image, String listImage) {
    }

}
