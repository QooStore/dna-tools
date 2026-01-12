package com.dna.tools.domain.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dna.tools.domain.admin.dto.AdminLoginRequest;
import com.dna.tools.domain.admin.dto.AdminLoginResponse;
import com.dna.tools.domain.admin.service.AdminAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/signin")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request) {
        String token = adminAuthService.login(request);
        return ResponseEntity.ok(new AdminLoginResponse(token));
    }
}