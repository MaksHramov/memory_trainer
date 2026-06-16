package com.memorytrainer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Введите логин")
        @Size(min = 3, message = "Логин должен быть не менее 3 символов")
        String username,

        @NotBlank(message = "Введите пароль")
        @Size(min = 6, message = "Пароль должен быть не менее 6 символов")
        String password
) {
}
