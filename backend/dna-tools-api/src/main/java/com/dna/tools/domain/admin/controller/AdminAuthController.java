package com.dna.tools.domain.admin.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.dna.tools.domain.admin.dto.AdminLoginRequest;
import com.dna.tools.domain.admin.service.AdminAuthService;

import lombok.RequiredArgsConstructor;

record LoginOkResponse(boolean success) {
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee")
public class AdminAuthController {

        private final AdminAuthService adminAuthService;

        @PostMapping("/signin")
        public ResponseEntity<?> signin(
                        @RequestBody AdminLoginRequest request) {
                String token = adminAuthService.login(request);

                // 브라우저의 모든 요청에 자동으로 쿠키가 포함된다.
                ResponseCookie cookie = ResponseCookie.from("admin_token", token) // 브라우저에 내려줄 HttpOnly쿠키 이름과 jwt 토큰 문자열
                                .httpOnly(true) // httpOnly쿠키 설정
                                .secure(false) // TODO: 운영 HTTPS면 true로 변경
                                .sameSite("Lax")
                                .path("/")
                                .maxAge(60 * 60) // 1시간(jwt.expiration과 동일하게 맞춤)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString()) // 헤더에 SET_COOKIE 설정하면 브라우저에서 자동으로 쿠키
                                                                                   // 저장
                                .body(new LoginOkResponse(true));
        }

        @PostMapping("/signout")
        public ResponseEntity<?> signout() {
                ResponseCookie cookie = ResponseCookie.from("admin_token", "")
                                .httpOnly(true)
                                .secure(false) // TODO: 운영 HTTPS면 true로 변경
                                .sameSite("Lax")
                                .path("/")
                                .maxAge(0) // 로그아웃 시 쿠키 삭제(만료)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(new LoginOkResponse(true));
        }

        @GetMapping("/me")
        public ResponseEntity<?> me(Authentication authentication) {
                // JWT 필터에서 인증 성공 시 SecurityContext에 들어있음
                if (authentication == null || !authentication.isAuthenticated()) {
                        return ResponseEntity.status(401).build();
                }

                return ResponseEntity.ok().build();
        }

}