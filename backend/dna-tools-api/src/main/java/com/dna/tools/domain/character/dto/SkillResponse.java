package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class SkillResponse {

    private final String name;
    private final String type;
    private final String typeName;
    private final String description;

    public SkillResponse(String name, String type, String typeName, String description) {
        this.name = name;
        this.type = type;
        this.typeName = typeName;
        this.description = description;
    }

}
