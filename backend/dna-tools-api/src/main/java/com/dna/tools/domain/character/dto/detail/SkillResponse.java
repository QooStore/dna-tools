package com.dna.tools.domain.character.dto.detail;

public class SkillResponse {

    private final String name;
    private final String description;

    public SkillResponse(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
