package com.dna.tools.domain.character.dto;

import lombok.Getter;

@Getter
public class PassiveUpgradeResponse {

    private final String upgradeKey;
    private final String name;
    private final String description;

    public PassiveUpgradeResponse(String upgradeKey, String name, String description) {
        this.upgradeKey = upgradeKey;
        this.name = name;
        this.description = description;
    }

}
