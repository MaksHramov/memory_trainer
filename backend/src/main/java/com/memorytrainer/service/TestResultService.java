package com.memorytrainer.service;

import com.memorytrainer.dto.SaveTestResultRequest;
import com.memorytrainer.dto.TestResultResponse;
import com.memorytrainer.entity.TestResult;
import com.memorytrainer.entity.User;
import com.memorytrainer.exception.AuthException;
import com.memorytrainer.repository.TestResultRepository;
import com.memorytrainer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class TestResultService {

    private static final Map<String, String> TEST_LABELS = Map.of(
            "MEMORY_WORDS", "Запоминание слов",
            "ATTENTION_ODD_ONE", "Тест на внимательность"
    );

    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public TestResultService(TestResultRepository testResultRepository, UserRepository userRepository) {
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TestResultResponse saveResult(String username, SaveTestResultRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("Пользователь не найден"));

        TestResult result = new TestResult(
                user,
                request.testType(),
                request.score(),
                request.maxScore()
        );

        return toResponse(testResultRepository.save(result));
    }

    @Transactional(readOnly = true)
    public List<TestResultResponse> getUserResults(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("Пользователь не найден"));

        return testResultRepository.findByUserOrderByCompletedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    private TestResultResponse toResponse(TestResult result) {
        String label = TEST_LABELS.getOrDefault(result.getTestType(), result.getTestType());
        return new TestResultResponse(
                result.getId(),
                result.getTestType(),
                label,
                result.getScore(),
                result.getMaxScore(),
                result.getCompletedAt()
        );
    }
}
