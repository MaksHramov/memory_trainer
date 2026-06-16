package com.memorytrainer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "test_results")
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String testType;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int maxScore;

    @Column(nullable = false, updatable = false)
    private Instant completedAt = Instant.now();

    protected TestResult() {
    }

    public TestResult(User user, String testType, int score, int maxScore) {
        this.user = user;
        this.testType = testType;
        this.score = score;
        this.maxScore = maxScore;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTestType() {
        return testType;
    }

    public int getScore() {
        return score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
