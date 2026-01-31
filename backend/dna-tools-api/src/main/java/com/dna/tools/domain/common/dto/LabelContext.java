package com.dna.tools.domain.common.dto;

import java.util.Map;

public class LabelContext {

    private final Map<String, Map<String, String>> labelMaps;

    public LabelContext(Map<String, Map<String, String>> labelMaps) {
        this.labelMaps = labelMaps;
    }

    public String label(String codeType, String code) {

        if (code == null)
            return null;

        return labelMaps.getOrDefault(codeType, Map.of()).getOrDefault(code, code);
    }

}
