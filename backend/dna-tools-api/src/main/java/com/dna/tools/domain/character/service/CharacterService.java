package com.dna.tools.domain.character.service;

import com.dna.tools.domain.character.dto.CharacterDetailResponse;
import com.dna.tools.domain.character.dto.CharacterFeatureResponse;
import com.dna.tools.domain.character.dto.CharacterListResponse;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.mapper.CharacterDetailMapper;
import com.dna.tools.domain.character.repository.CharacterRepository;
import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.common.service.CommonCodeLabelService;
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
public class CharacterService {

        private final CharacterRepository characterRepository;
        private final CommonCodeLabelService commonCodeLabelService;
        private final CharacterDetailMapper characterDetailMapper;
        private final ImageStorage imageStorage;

        public CharacterDetailResponse getCharacterDetail(String slug) {
                CharacterEntity character = characterRepository.findBySlug(slug)
                                .orElseThrow(() -> new BusinessException(ErrorCode.CHARACTER_NOT_FOUND));

                LabelContext labels = commonCodeLabelService.getLabelContext(List.of(
                                "FEATURE",
                                "ELEMENT",
                                "MELEEWEAPON",
                                "RANGEDWEAPON",
                                "ATTACK_TYPE",
                                "WORD",
                                "CATEGORY",
                                "SKILL_TYPE"));

                return characterDetailMapper.toResponse(character, labels);
        }

        public List<CharacterListResponse> getAllCharacters() {
                List<CharacterEntity> characters = characterRepository.findAllCharacterList();

                LabelContext labels = commonCodeLabelService.getLabelContext(List.of("FEATURE"));

                return characters.stream()
                                .map(c -> toListResponse(c, labels))
                                .toList();
        }

        private CharacterListResponse toListResponse(CharacterEntity character, LabelContext labels) {
                return new CharacterListResponse(character.getId(), character.getSlug(), character.getName(),
                                character.getElement(), labels.label("ELEMENT", character.getElement()),
                                imageStorage.getUrl(character.getListImage()),
                                character.getElementImage(),
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

}
