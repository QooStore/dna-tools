package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class SkillResponse {

    private final String name;
    private final String type;
    private final String description;

    public SkillResponse(String name, String type, String description) {
        this.name = name;
        this.type = type;
        this.description = description;
    }

}
