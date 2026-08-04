package com.hydroguard.service;

import com.hydroguard.dto.WaterReadingRequest;
import com.hydroguard.model.Alert;
import com.hydroguard.model.SystemSettings;
import com.hydroguard.model.SystemStatus;
import com.hydroguard.model.WaterReading;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class WaterLevelService {
  private final AtomicLong readingIds = new AtomicLong(12);
  private final AtomicLong alertIds = new AtomicLong(2);
  private final List<WaterReading> readings = new ArrayList<>();
  private final List<Alert> alerts = new ArrayList<>();
  private SystemSettings settings = new SystemSettings(30, 80, "AUTOMATIC", true);
  private String deviceName = "HydroGuard Main Controller";
  private String deviceStatus = "ONLINE";
  private Instant lastSeen = Instant.now();

  public WaterLevelService() {
    // Demo timeline showing tank drawdown followed by automatic refill pumping from reservoir
    double[] percentages = {75, 68, 60, 52, 44, 36, 26, 38, 50, 62, 74, 80};
    boolean[] pumps =      {false, false, false, false, false, false, true, true, true, true, true, false};
    Instant start = Instant.now().minusSeconds(11 * 30 * 60L);
    for (int index = 0; index < percentages.length; index++) {
      double percentage = percentages[index];
      boolean pump = pumps[index];
      readings.add(new WaterReading(
          index + 1,
          percentage,
          Math.round((28 - percentage * 0.22) * 10.0) / 10.0,
          pump,
          percentage <= settings.lowThreshold() || percentage >= settings.highThreshold(),
          start.plusSeconds(index * 30 * 60L)
      ));
    }
    alerts.add(new Alert(
        1,
        "PUMP_STOPPED",
        "Refill complete — pump stopped after storage tank reached target capacity.",
        "INFO",
        true,
        Instant.now().minusSeconds(15 * 60L)
    ));
    alerts.add(new Alert(
        2,
        "PUMP_ACTIVATED",
        "Low water level detected (26%). Refill pump activated automatically to draw from reservoir.",
        "WARNING",
        true,
        Instant.now().minusSeconds(3 * 60 * 60L)
    ));
  }

  public synchronized SystemStatus currentStatus() {
    WaterReading latest = latestReading();
    return new SystemStatus(
        deviceName,
        deviceStatus,
        latest.waterLevelPercentage(),
        latest.distanceCm(),
        waterStatus(latest.waterLevelPercentage()),
        latest.pumpStatus(),
        latest.buzzerStatus(),
        lastSeen,
        settings.lowThreshold(),
        settings.highThreshold(),
        settings.pumpMode(),
        settings.buzzerEnabled()
    );
  }

  public synchronized List<WaterReading> history() {
    return readings.stream()
        .sorted(Comparator.comparing(WaterReading::createdAt))
        .toList();
  }

  public synchronized List<Alert> alerts() {
    return alerts.stream()
        .sorted(Comparator.comparing(Alert::createdAt).reversed())
        .toList();
  }

  public synchronized SystemSettings settings() {
    return settings;
  }

  public synchronized SystemSettings updateSettings(SystemSettings nextSettings) {
    settings = new SystemSettings(
        clamp(nextSettings.lowThreshold()),
        clamp(nextSettings.highThreshold()),
        nextSettings.pumpMode() == null ? settings.pumpMode() : nextSettings.pumpMode(),
        nextSettings.buzzerEnabled()
    );
    return settings;
  }

  public synchronized SystemStatus submitReading(WaterReadingRequest request) {
    WaterReading previous = latestReading();
    double percentage = request.waterLevelPercentage() == null
        ? previous.waterLevelPercentage()
        : clamp(request.waterLevelPercentage());
    boolean pumpStatus = request.pumpStatus() == null
        ? shouldPumpRun(percentage, previous.pumpStatus())
        : request.pumpStatus();
    boolean buzzerStatus = request.buzzerStatus() == null
        ? settings.buzzerEnabled() && isAbnormal(percentage)
        : request.buzzerStatus();

    readings.add(new WaterReading(
        readingIds.incrementAndGet(),
        percentage,
        request.distanceCm() == null ? previous.distanceCm() : request.distanceCm(),
        pumpStatus,
        buzzerStatus,
        Instant.now()
    ));
    deviceStatus = request.deviceStatus() == null ? "ONLINE" : request.deviceStatus();
    lastSeen = Instant.now();
    createAlertIfNeeded(percentage, pumpStatus);
    return currentStatus();
  }

  public synchronized SystemStatus setPump(boolean running) {
    WaterReading previous = latestReading();
    readings.add(new WaterReading(
        readingIds.incrementAndGet(),
        previous.waterLevelPercentage(),
        previous.distanceCm(),
        running,
        previous.buzzerStatus(),
        Instant.now()
    ));
    alerts.add(new Alert(
        alertIds.incrementAndGet(),
        running ? "PUMP_ACTIVATED" : "PUMP_STOPPED",
        running ? "Refill pump activated manually — pumping water from reservoir into tank." : "Refill pump stopped manually.",
        "INFO",
        false,
        Instant.now()
    ));
    return currentStatus();
  }

  private WaterReading latestReading() {
    return readings.get(readings.size() - 1);
  }

  private String waterStatus(double percentage) {
    if (percentage <= settings.lowThreshold()) {
      return "LOW";
    }
    if (percentage >= settings.highThreshold()) {
      return "HIGH";
    }
    return "NORMAL";
  }

  private boolean shouldPumpRun(double percentage, boolean currentPumpState) {
    if (!"AUTOMATIC".equalsIgnoreCase(settings.pumpMode())) {
      return currentPumpState;
    }
    if (percentage <= settings.lowThreshold()) {
      return true; // Start refill pumping
    }
    if (percentage >= settings.highThreshold()) {
      return false; // Stop refill pumping when full
    }
    return currentPumpState; // Maintain current state between thresholds
  }

  private boolean isAbnormal(double percentage) {
    return percentage <= settings.lowThreshold() || percentage >= settings.highThreshold();
  }

  private double clamp(double percentage) {
    return Math.max(0, Math.min(100, percentage));
  }

  private void createAlertIfNeeded(double percentage, boolean pumpStatus) {
    if (percentage <= settings.lowThreshold()) {
      alerts.add(new Alert(
          alertIds.incrementAndGet(),
          "LOW_WATER",
          pumpStatus
              ? "Low water detected in storage tank. Refill pump activated — drawing from reservoir."
              : "Water level is below the configured threshold.",
          "WARNING",
          false,
          Instant.now()
      ));
    } else if (percentage >= settings.highThreshold()) {
      alerts.add(new Alert(
          alertIds.incrementAndGet(),
          "HIGH_WATER",
          "Storage tank has reached target high capacity.",
          "INFO",
          false,
          Instant.now()
      ));
    }
  }
}
