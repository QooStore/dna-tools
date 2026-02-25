package com.dna.tools.domain.admin.service;

import com.dna.tools.domain.admin.dto.DemonWedgeSaveRequest;
import com.dna.tools.domain.demonwedge.entity.DemonWedgeEntity;
import com.dna.tools.domain.demonwedge.repository.DemonWedgeRepository;
import com.dna.tools.domain.image.service.ImageUsageService;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DemonWedgeAdminService {

    private final DemonWedgeRepository demonWedgeRepository;
    private final ImageUsageService imageUsageService;

    @Transactional
    public void create(DemonWedgeSaveRequest req) {

        DemonWedgeEntity entity = DemonWedgeEntity.create(
                req.getSlug(),
                req.getName(),
                imageUsageService.extractFilename(req.getImage()),
                req.getRarity(),
                req.getResistance(),
                req.getTendency(),
                req.getEquipType(),
                req.getElement(),
                req.getIsKukulkan() != null ? req.getIsKukulkan() : false,
                req.getEffectDescription());

        // 스탯 추가
        if (req.getStats() != null) {
            for (var stat : req.getStats()) {
                entity.addStat(stat.getStatType(), stat.getValue());
            }
        }

        // 조건부 효과 추가
        if (req.getConditionalEffects() != null) {
            for (var e : req.getConditionalEffects()) {
                entity.addConditionalEffect(e.getStatType(), e.getValue());
            }
        }

        try {
            demonWedgeRepository.save(entity);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.DEMON_WEDGE_SLUG_DUPLICATE);
        }

        imageUsageService.markUsed(entity.getImage());
    }

    @Transactional
    public void updateBySlug(String slug, DemonWedgeSaveRequest req) {

        DemonWedgeEntity entity = demonWedgeRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEMON_WEDGE_NOT_FOUND));

        // slug 변경 시 중복 체크
        if (!entity.getSlug().equals(req.getSlug())
                && demonWedgeRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BusinessException(ErrorCode.DEMON_WEDGE_SLUG_DUPLICATE);
        }

        String prevImage = entity.getImage();

        entity.update(
                req.getSlug(),
                req.getName(),
                imageUsageService.extractFilename(req.getImage()),
                req.getRarity(),
                req.getResistance(),
                req.getTendency(),
                req.getEquipType(),
                req.getElement(),
                req.getIsKukulkan() != null ? req.getIsKukulkan() : false,
                req.getEffectDescription());

        // 스탯 갱신
        entity.clearStats();
        if (req.getStats() != null) {
            for (var stat : req.getStats()) {
                entity.addStat(stat.getStatType(), stat.getValue());
            }
        }

        // 조건부 효과 갱신
        entity.clearConditionalEffects();
        if (req.getConditionalEffects() != null) {
            for (var e : req.getConditionalEffects()) {
                entity.addConditionalEffect(e.getStatType(), e.getValue());
            }
        }

        imageUsageService.markUsed(entity.getImage());
        imageUsageService.unmarkIfChanged(prevImage, entity.getImage());
    }

    @Transactional
    public void delete(long id) {

        DemonWedgeEntity entity = demonWedgeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEMON_WEDGE_NOT_FOUND));

        imageUsageService.markUnused(entity.getImage());
        demonWedgeRepository.deleteById(id);
    }
}
