package com.memorytrainer.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Введите логин")
        String username,

        @NotBlank(message = "Введите пароль")
        String password
) {
}
