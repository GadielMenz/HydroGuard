package com.hydroguard.model;

public record SystemSettings(
    double lowThreshold,
    double highThreshold,
    String pumpMode,
    boolean buzzerEnabled
) {}
