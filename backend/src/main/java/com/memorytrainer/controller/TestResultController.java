package com.memorytrainer.controller;

import com.memorytrainer.dto.SaveTestResultRequest;
import com.memorytrainer.dto.TestResultResponse;
import com.memorytrainer.service.TestResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestResultController {

    private final TestResultService testResultService;

    public TestResultController(TestResultService testResultService) {
        this.testResultService = testResultService;
    }

    @PostMapping("/results")
    @ResponseStatus(HttpStatus.CREATED)
    public TestResultResponse saveResult(
            Authentication authentication,
            @Valid @RequestBody SaveTestResultRequest request
    ) {
        return testResultService.saveResult(authentication.getName(), request);
    }

    @GetMapping("/results")
    public List<TestResultResponse> getResults(Authentication authentication) {
        return testResultService.getUserResults(authentication.getName());
    }
}
