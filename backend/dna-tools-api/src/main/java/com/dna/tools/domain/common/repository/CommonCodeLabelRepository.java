package com.dna.tools.domain.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dna.tools.domain.common.entity.CommonCodeLabelEntity;
import com.dna.tools.domain.common.entity.CommonCodeLabelId;

public interface CommonCodeLabelRepository
                extends JpaRepository<CommonCodeLabelEntity, CommonCodeLabelId> {

        List<CommonCodeLabelEntity> findByCodeType(String codeType);
}
