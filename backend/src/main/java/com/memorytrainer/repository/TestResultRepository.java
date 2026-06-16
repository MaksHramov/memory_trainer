package com.memorytrainer.repository;

import com.memorytrainer.entity.TestResult;
import com.memorytrainer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    List<TestResult> findByUserOrderByCompletedAtDesc(User user);
}
