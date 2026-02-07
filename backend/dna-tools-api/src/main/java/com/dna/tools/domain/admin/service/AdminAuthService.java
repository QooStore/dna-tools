package com.dna.tools.domain.admin.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dna.tools.domain.admin.dto.AdminLoginRequest;
import com.dna.tools.domain.admin.entity.AdminUser;
import com.dna.tools.domain.admin.repository.AdminUserRepository;
import com.dna.tools.exception.BusinessException;
import com.dna.tools.exception.ErrorCode;
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
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_USER_NOT_FOUND));

        // 프론트에서 넘어온 평문 비밀번호와 DB에 저장된 암호화된 비밀번호 비교
        // bcrypt 해시 문자열은 같은 암호를 encode해도 해시 결과가 다르다.
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_PASSWORD);
        }

        return jwtProvider.createToken(admin.getId(), admin.getRole());
    }
}
