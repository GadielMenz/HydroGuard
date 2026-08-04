package com.hydroguard.model;

import java.time.Instant;

public record Alert(
    long id,
    String type,
    String message,
    String severity,
    boolean resolved,
    Instant createdAt
) {}
