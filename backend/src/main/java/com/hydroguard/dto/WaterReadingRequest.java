package com.hydroguard.dto;

public record WaterReadingRequest(
    Double waterLevelPercentage,
    Double distanceCm,
    Boolean pumpStatus,
    Boolean buzzerStatus,
    String deviceStatus
) {}
