package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class IntronResponse {

    private final int stage;
    private final String description;

    public IntronResponse(int stage, String description) {
        this.stage = stage;
        this.description = description;
    }

}
