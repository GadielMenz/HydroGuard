package com.hydroguard.model;

import java.time.Instant;

public record SystemStatus(
    String deviceName,
    String deviceStatus,
    double waterLevelPercentage,
    double distanceCm,
    String waterStatus,
    boolean pumpStatus,
    boolean buzzerStatus,
    Instant lastSeen,
    double lowThreshold,
    double highThreshold,
    String pumpMode,
    boolean buzzerEnabled
) {}
