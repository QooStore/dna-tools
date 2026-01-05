package com.dna.tools.domain.character.service;

import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // final 필드만 생성자 주입
@Transactional(readOnly = true)
public class CharacterDetailService {

    private final CharacterRepository characterRepository;

    public CharacterEntity getCharacterBySlug(String slug) {
        return characterRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Character not found. slug=" + slug));
    }
}
