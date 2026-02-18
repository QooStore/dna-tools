package com.dna.tools.security.jwt;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 쿠키에서 토큰 찾기
        String token = resolveToken(request);

        if (token != null && jwtProvider.validateToken(token)) {
            Claims claims = jwtProvider.parseClaims(token);

            String adminId = claims.getSubject();
            String role = claims.get("role", String.class);

            GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

            // Authentication 객체 생성
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    adminId,
                    null,
                    List.of(authority));

            // SecurityContext에 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Sliding session: 인증된 요청마다 토큰 갱신 (만료 시간 연장)
            String newToken = jwtProvider.createToken(Long.parseLong(adminId), role);
            long maxAgeSeconds = jwtProvider.getExpirationMs() / 1000;
            ResponseCookie cookie = ResponseCookie.from("admin_token", newToken)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(maxAgeSeconds)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        // 요청을 다음 필터로 넘기기
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        // 1) 쿠키 우선
        String cookieToken = getCookieValue(request, "admin_token");
        if (cookieToken != null && !cookieToken.isBlank()) {
            return cookieToken;
        }

        // 2) 헤더 fallback (테스트/Postman용)
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            return null;

        for (Cookie c : cookies) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

}
