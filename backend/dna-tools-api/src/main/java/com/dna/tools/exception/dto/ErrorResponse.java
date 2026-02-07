package com.dna.tools.exception.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private boolean success;
    private String errorCode;
    private String message;
    private Map<String, String> details;
}
