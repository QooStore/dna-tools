package com.dna.tools.domain.common.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dna.tools.domain.common.dto.CodeOptionResponse;
import com.dna.tools.domain.common.service.CommonCodeLabelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class CommonCodeController {

    private final CommonCodeLabelService commonCodeLabelService;

    @GetMapping("/{codeType}")
    public List<CodeOptionResponse> getOptions(@PathVariable String codeType) {
        return commonCodeLabelService.getAllLabelMap(codeType.toUpperCase())
                .entrySet().stream()
                .map(e -> new CodeOptionResponse(e.getKey(), e.getValue()))
                .toList();
    }
}
