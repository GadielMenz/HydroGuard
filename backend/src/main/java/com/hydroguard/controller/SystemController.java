package com.hydroguard.controller;

import com.hydroguard.model.Alert;
import com.hydroguard.model.SystemSettings;
import com.hydroguard.model.SystemStatus;
import com.hydroguard.service.WaterLevelService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SystemController {
  private final WaterLevelService waterLevelService;

  public SystemController(WaterLevelService waterLevelService) {
    this.waterLevelService = waterLevelService;
  }

  @GetMapping("/status")
  public SystemStatus status() {
    return waterLevelService.currentStatus();
  }

  @GetMapping("/alerts")
  public List<Alert> alerts() {
    return waterLevelService.alerts();
  }

  @GetMapping("/settings")
  public SystemSettings settings() {
    return waterLevelService.settings();
  }

  @PutMapping("/settings")
  public SystemSettings updateSettings(@RequestBody SystemSettings settings) {
    return waterLevelService.updateSettings(settings);
  }

  @PostMapping("/pump/on")
  public SystemStatus pumpOn() {
    return waterLevelService.setPump(true);
  }

  @PostMapping("/pump/off")
  public SystemStatus pumpOff() {
    return waterLevelService.setPump(false);
  }
}
