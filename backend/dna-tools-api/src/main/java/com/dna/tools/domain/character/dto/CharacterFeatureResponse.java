package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class CharacterFeatureResponse {

    private final String featureCode;

    public CharacterFeatureResponse(String featureCode) {
        this.featureCode = featureCode;
    }

}
