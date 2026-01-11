package com.dna.tools.domain.character.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class CharacterListResponse {

    private final Long id;
    private final String slug;
    private final String name;
    private final String elementCode;
    private final String listImage;
    private final String elementImage;
    private final String meleeProficiency;
    private final String rangedProficiency;
    private final List<CharacterFeatureResponse> features;

    public CharacterListResponse(Long id, String slug, String name, String elementCode, String listImage,
            String elementImage, String meleeProficiency, String rangedProficiency,
            List<CharacterFeatureResponse> features) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.elementCode = elementCode;
        this.listImage = listImage;
        this.elementImage = elementImage;
        this.meleeProficiency = meleeProficiency;
        this.rangedProficiency = rangedProficiency;
        this.features = features;
    }

}
