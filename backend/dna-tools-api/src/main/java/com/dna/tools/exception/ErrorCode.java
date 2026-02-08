package com.dna.tools.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 이미지
    IMAGE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다"),
    IMAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "이미지를 찾을 수 없습니다"),
    IMAGE_IN_USE(HttpStatus.CONFLICT, "사용 중인 이미지는 삭제할 수 없습니다"),
    IMAGE_EMPTY(HttpStatus.BAD_REQUEST, "파일이 비어있습니다"),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다"),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 제한을 초과했습니다"),

    // 캐릭터
    CHARACTER_NOT_FOUND(HttpStatus.NOT_FOUND, "캐릭터를 찾을 수 없습니다"),
    CHARACTER_SLUG_DUPLICATE(HttpStatus.CONFLICT, "이미 사용 중인 slug입니다"),

    // 무기
    WEAPON_NOT_FOUND(HttpStatus.NOT_FOUND, "무기를 찾을 수 없습니다"),
    WEAPON_SLUG_DUPLICATE(HttpStatus.CONFLICT, "이미 사용 중인 무기 slug입니다"),

    // 인증
    AUTH_USER_NOT_FOUND(HttpStatus.UNAUTHORIZED, "존재하지 않는 관리자입니다"),
    AUTH_INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 올바르지 않습니다");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
