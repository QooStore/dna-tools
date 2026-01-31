package com.dna.tools.domain.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "common_code_labels")
@IdClass(CommonCodeLabelId.class)
public class CommonCodeLabelEntity {

    @Id
    @Column(name = "code_type", length = 30)
    private String codeType;

    @Id
    @Column(name = "code", length = 30)
    private String code;

    @Id
    @Column(name = "label", length = 50)
    private String label;
}
