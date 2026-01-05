package com.dna.tools.domain.character.dto.detail;

public class IntronResponse {

    private final int stage;
    private final String description;

    public IntronResponse(int stage, String description) {
        this.stage = stage;
        this.description = description;
    }

    public int getStage() {
        return stage;
    }

    public String getDescription() {
        return description;
    }
}
