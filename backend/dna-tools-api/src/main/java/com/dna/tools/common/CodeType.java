package com.dna.tools.common;

public enum CodeType {
    ELEMENT("속성"),
    STAT("스탯"),
    WEAPON("무기"),
    ATTACK_TYPE("공격 유형"),
    WEAPON_CATEGORY("무기 카테고리"),
    FEATURE("특성"),
    WORD("일반 단어");

    private final String description;

    CodeType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
