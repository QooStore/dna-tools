package com.dna.tools.domain.common.service;

import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 공통 코드 라벨 캐시를 주기적으로 초기화하여 DB 변경사항을 반영한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CodeLabelCacheEvictJob {

    private final CacheManager cacheManager;

    @Scheduled(fixedRate = 30_000) // 30초마다 갱신
    public void evictCodeLabelCache() {
        var cache = cacheManager.getCache("commonCodeLabelAll");
        if (cache != null) {
            cache.clear();
            log.debug("공통 코드 라벨 캐시 초기화 완료");
        }
    }
}
