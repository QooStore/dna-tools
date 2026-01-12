package com.dna.tools.domain.admin.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dna.tools.domain.admin.dto.AdminLoginRequest;
import com.dna.tools.domain.admin.entity.AdminUser;
import com.dna.tools.domain.admin.repository.AdminUserRepository;
import com.dna.tools.security.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public String login(AdminLoginRequest request) {
        AdminUser admin = adminUserRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다");
        }

        return jwtProvider.createToken(admin.getId(), admin.getRole());
    }
}
