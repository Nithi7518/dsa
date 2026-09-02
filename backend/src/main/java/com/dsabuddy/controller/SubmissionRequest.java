package com.dsabuddy.controller;

public record SubmissionRequest(
    Long problemId,
    String code,
    String language,
    boolean isCorrect
) {}
