package com.dna.tools.domain.character.controller;

import com.dna.tools.domain.character.dto.CharacterDetailResponse;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.mapper.CharacterDetailMapper;
import com.dna.tools.domain.character.service.CharacterDetailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private final CharacterDetailService characterDetailService;

    public CharacterController(CharacterDetailService characterDetailService) {
        this.characterDetailService = characterDetailService;
    }

    @GetMapping("/{slug}")
    public CharacterDetailResponse getCharacterDetail(
            @PathVariable String slug) {
        CharacterEntity character = characterDetailService.getCharacterBySlug(slug);

        return CharacterDetailMapper.toResponse(character);
    }
}