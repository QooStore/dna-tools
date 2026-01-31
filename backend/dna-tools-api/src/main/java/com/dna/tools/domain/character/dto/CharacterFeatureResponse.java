package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class CharacterFeatureResponse {

    private final String featureCode;
    private final String featureName;

    public CharacterFeatureResponse(String featureCode, String featureName) {
        this.featureCode = featureCode;
        this.featureName = featureName;
    }

}
