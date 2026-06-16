package com.memorytrainer.service;

import com.memorytrainer.dto.AuthResponse;
import com.memorytrainer.dto.LoginRequest;
import com.memorytrainer.dto.RegisterRequest;
import com.memorytrainer.entity.User;
import com.memorytrainer.exception.AuthException;
import com.memorytrainer.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();

        if (userRepository.existsByUsername(username)) {
            throw new AuthException("Пользователь с таким логином уже существует");
        }

        User user = new User(username, passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return buildResponse(username);
    }

    public AuthResponse login(LoginRequest request) {
        String username = request.username().trim();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("Неверный логин или пароль"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthException("Неверный логин или пароль");
        }

        return buildResponse(username);
    }

    private AuthResponse buildResponse(String username) {
        String token = jwtService.generateToken(username);
        return new AuthResponse(token, username);
    }
}
