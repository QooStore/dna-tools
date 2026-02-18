package com.dna.tools.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationMs;

    /** 토큰 생성 */
    public String createToken(Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // PK로 토큰 주인 표시
                .claim("role", role) // 커스텀 클레임 정보
                .setIssuedAt(now) // 토큰 발급 시간
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 위의 내용을 HS256 방식으로 서명(대칭키 방식)
                                                                     // RS256방식(공개/개인키 방식도 있다.)
                .compact(); // JWT Builder -> 문자열 반환(형식 예시 : xxxxx.yyyyy.zzzzz)
    }

    /** 서명 키 */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    /** 토큰 검증 */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
