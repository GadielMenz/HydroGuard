package com.hydroguard.model;

import java.time.Instant;

public record WaterReading(
    long id,
    double waterLevelPercentage,
    double distanceCm,
    boolean pumpStatus,
    boolean buzzerStatus,
    Instant createdAt
) {}
