package com.dsabuddy.controller;

public record ChatRequest(
    String code,
    String language,
    String message
) {}
