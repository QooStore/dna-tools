package com.dna.tools.domain.common.entity;

import java.io.Serializable;
import java.util.Objects;

public class CommonCodeLabelId implements Serializable {

    private String codeType;
    private String code;
    private String label;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CommonCodeLabelId))
            return false;
        CommonCodeLabelId that = (CommonCodeLabelId) o;
        return Objects.equals(codeType, that.codeType)
                && Objects.equals(code, that.code)
                && Objects.equals(label, that.label);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codeType, code, label);
    }
}
