package com.dna.tools.domain.demonwedge.service;

import com.dna.tools.domain.common.dto.ConditionalEffectResponse;
import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.common.service.CommonCodeLabelService;
import com.dna.tools.domain.demonwedge.dto.DemonWedgeDetailResponse;
import com.dna.tools.domain.demonwedge.dto.DemonWedgeListResponse;
import com.dna.tools.domain.demonwedge.entity.DemonWedgeConditionalEffectEntity;
import com.dna.tools.domain.demonwedge.entity.DemonWedgeEntity;
import com.dna.tools.domain.demonwedge.repository.DemonWedgeRepository;
import com.dna.tools.domain.image.storage.ImageStorage;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DemonWedgeService {

    private final DemonWedgeRepository demonWedgeRepository;
    private final CommonCodeLabelService commonCodeLabelService;
    private final ImageStorage imageStorage;

    public List<DemonWedgeListResponse> getAllDemonWedges() {
        List<DemonWedgeEntity> entities = demonWedgeRepository.findAllWithStats();

        LabelContext labels = commonCodeLabelService.getLabelContext(List.of(
                "ELEMENT",
                "EQUIP_TYPE",
                "TENDENCY",
                "STAT"));

        return entities.stream()
                .map(e -> toListResponse(e, labels))
                .toList();
    }

    public DemonWedgeDetailResponse getDemonWedgeBySlug(String slug) {
        DemonWedgeEntity e = demonWedgeRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEMON_WEDGE_NOT_FOUND));

        return DemonWedgeDetailResponse.builder()
                .id(e.getId())
                .slug(e.getSlug())
                .name(e.getName())
                .image(e.getImage() != null ? imageStorage.getUrl(e.getImage()) : null)
                .rarity(e.getRarity())
                .resistance(e.getResistance())
                .tendency(e.getTendency())
                .equipType(e.getEquipType())
                .element(e.getElement())
                .isKukulkan(e.getIsKukulkan())
                .effectDescription(e.getEffectDescription())
                .stats(e.getStats().stream()
                        .map(s -> DemonWedgeDetailResponse.StatResponse.builder()
                                .statType(s.getStatType())
                                .value(s.getValue())
                                .build())
                        .toList())
                .conditionalEffects(toConditionalEffects(e))
                .build();
    }

    private DemonWedgeListResponse toListResponse(DemonWedgeEntity e, LabelContext labels) {
        return DemonWedgeListResponse.builder()
                .id(e.getId())
                .slug(e.getSlug())
                .name(e.getName())
                .image(e.getImage() != null ? imageStorage.getUrl(e.getImage()) : null)
                .rarity(e.getRarity())
                .resistance(e.getResistance())
                .tendency(e.getTendency())
                .tendencyLabel(labels.label("TENDENCY", e.getTendency()))
                .equipType(e.getEquipType())
                .equipTypeLabel(labels.label("EQUIP_TYPE", e.getEquipType()))
                .element(e.getElement())
                .elementLabel(labels.label("ELEMENT", e.getElement()))
                .isKukulkan(e.getIsKukulkan())
                .effectDescription(e.getEffectDescription())
                .itemCode(e.getItemCode())
                .stats(e.getStats().stream()
                        .map(s -> DemonWedgeListResponse.StatResponse.builder()
                                .statType(s.getStatType())
                                .statTypeLabel(labels.label("STAT", s.getStatType()))
                                .value(s.getValue())
                                .build())
                        .toList())
                .conditionalEffects(toConditionalEffects(e))
                .build();
    }

    private List<ConditionalEffectResponse> toConditionalEffects(DemonWedgeEntity e) {
        return e.getConditionalEffects().stream()
                .map(c -> new ConditionalEffectResponse(
                        c.getId(), null, null,
                        c.getStatType(), c.getValue()))
                .toList();
    }
}
