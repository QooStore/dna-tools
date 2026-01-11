package com.dna.tools.domain.character.service;

import com.dna.tools.domain.character.dto.CharacterFeatureResponse;
import com.dna.tools.domain.character.dto.CharacterListResponse;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // final 필드만 생성자 주입
@Transactional(readOnly = true)
public class CharacterService {

    private final CharacterRepository characterRepository;

    public CharacterEntity getCharacterBySlug(String slug) {
        return characterRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Character not found. slug=" + slug));
    }

    // 목록 조회는 join table이 1개뿐이라 mapper사용 대신 map으로 entity, dto(response) 조인.
    private CharacterListResponse toListResponse(CharacterEntity character) {
        return new CharacterListResponse(character.getId(), character.getSlug(), character.getName(),
                character.getElement(), character.getListImage(), character.getElementImage(),
                character.getMeleeProficiency(), character.getRangedProficiency(),
                character.getFeatures().stream().map(feature -> new CharacterFeatureResponse(feature.getFeature()))
                        .toList());
    }

    public List<CharacterListResponse> getAllCharacters() {
        return characterRepository.findAllCharacterList().stream().map(this::toListResponse).toList();
    }

    public void deleteCharacter(Long id) {
        characterRepository.deleteById(id);
    }
}
