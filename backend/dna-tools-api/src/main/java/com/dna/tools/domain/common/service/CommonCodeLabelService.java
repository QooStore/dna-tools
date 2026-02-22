package com.dna.tools.domain.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.dna.tools.domain.common.dto.LabelContext;
import com.dna.tools.domain.common.entity.CommonCodeLabelEntity;
import com.dna.tools.domain.common.repository.CommonCodeLabelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonCodeLabelService {

    private final CommonCodeLabelRepository repository;

    @Cacheable(value = "commonCodeLabelAll", key = "#codeType")
    public Map<String, String> getAllLabelMap(String codeType) {
        return repository.findByCodeType(codeType).stream()
                .collect(Collectors.toMap(
                        CommonCodeLabelEntity::getCode,
                        CommonCodeLabelEntity::getLabel,
                        (a, b) -> a));
    }

    // 캐시 없이 항상 DB에서 직접 조회 (selectbox 옵션용)
    public Map<String, String> getAllLabelMapFresh(String codeType) {
        return repository.findByCodeType(codeType).stream()
                .collect(Collectors.toMap(
                        CommonCodeLabelEntity::getCode,
                        CommonCodeLabelEntity::getLabel,
                        (a, b) -> a));
    }

    // 여러 codeType을 한 번에 LabelContext로
    public LabelContext getLabelContext(List<String> codeTypes) {

        Map<String, Map<String, String>> result = new HashMap<>();

        for (String ct : codeTypes) {
            result.put(ct, getAllLabelMap(ct)); // 캐시 hit
        }

        return new LabelContext(result);
    }

}
