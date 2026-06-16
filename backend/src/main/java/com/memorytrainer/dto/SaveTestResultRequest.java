package com.memorytrainer.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaveTestResultRequest(
        @NotBlank(message = "Укажите тип теста")
        String testType,

        @NotNull(message = "Укажите результат")
        @Min(value = 0, message = "Результат не может быть отрицательным")
        Integer score,

        @NotNull(message = "Укажите максимальный балл")
        @Min(value = 1, message = "Максимальный балл должен быть больше 0")
        Integer maxScore
) {
}
