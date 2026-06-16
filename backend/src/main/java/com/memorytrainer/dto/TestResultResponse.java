package com.memorytrainer.dto;

import java.time.Instant;

public record TestResultResponse(
        Long id,
        String testType,
        String testTypeLabel,
        int score,
        int maxScore,
        Instant completedAt
) {
}
