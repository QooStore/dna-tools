package com.dna.tools.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

// @Scheduled가 붙은 메서드 실행(스케줄링)
@EnableScheduling
@Configuration
public class SchedulerConfig {
}