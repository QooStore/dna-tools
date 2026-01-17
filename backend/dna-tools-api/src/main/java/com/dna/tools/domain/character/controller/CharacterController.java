package com.dna.tools.domain.character.controller;

import com.dna.tools.domain.character.dto.CharacterDetailResponse;
import com.dna.tools.domain.character.dto.CharacterListResponse;
import com.dna.tools.domain.character.entity.CharacterEntity;
import com.dna.tools.domain.character.mapper.CharacterDetailMapper;
import com.dna.tools.domain.character.service.CharacterService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterDetailService) {
        this.characterService = characterDetailService;
    }

    @GetMapping
    public List<CharacterListResponse> getAllCharacters() {
        return characterService.getAllCharacters();
    }

    @GetMapping("/{slug}")
    public CharacterDetailResponse getCharacterDetail(
            @PathVariable String slug) {
        CharacterEntity character = characterService.getCharacterBySlug(slug);

        return CharacterDetailMapper.toResponse(character);
    }

}