package com.dna.tools.domain.character.service;

import com.dna.tools.domain.character.dto.CharacterDetailResponse;
import com.dna.tools.domain.character.dto.CharacterFeatureResponse;
import com.dna.tools.domain.character.dto.CharacterListResponse;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.mapper.CharacterDetailMapper;
import com.dna.tools.domain.character.repository.CharacterRepository;
import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.common.service.CommonCodeLabelService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // final 필드만 생성자 주입
@Transactional(readOnly = true)
public class CharacterService {

        private final CharacterRepository characterRepository;
        private final CommonCodeLabelService commonCodeLabelService;

        public CharacterDetailResponse getCharacterDetail(String slug) {
                CharacterEntity character = characterRepository.findBySlug(slug)
                                .orElseThrow(() -> new IllegalArgumentException("Character not found. slug=" + slug));

                LabelContext labels = commonCodeLabelService.getLabelContext(List.of(
                                "FEATURE",
                                "ELEMENT",
                                "MELEEWEAPON",
                                "RANGEDWEAPON",
                                "ATTACK_TYPE",
                                "WORD"));

                return CharacterDetailMapper.toResponse(character, labels);

        }

        // 목록 조회 DTO 조립
        private CharacterListResponse toListResponse(CharacterEntity character, LabelContext labels) {
                return new CharacterListResponse(character.getId(), character.getSlug(), character.getName(),
                                character.getElement(), labels.label("ELEMENT", character.getElement()),
                                character.getListImage(), character.getElementImage(),
                                character.getMeleeProficiency(),
                                labels.label("MELEEWEAPON", character.getMeleeProficiency()),
                                character.getRangedProficiency(),
                                labels.label("RANGEDWEAPON", character.getRangedProficiency()),
                                character.getFeatures().stream()
                                                .map(feature -> new CharacterFeatureResponse(feature.getFeature(),
                                                                labels.label("FEATURE",
                                                                                feature.getFeature())))
                                                .toList());
        }

        public List<CharacterListResponse> getAllCharacters() {
                List<CharacterEntity> characters = characterRepository.findAllCharacterList();

                LabelContext labels = commonCodeLabelService.getLabelContext(List.of("FEATURE"));

                return characters.stream()
                                .map(c -> toListResponse(c, labels))
                                .toList();
        }

}
