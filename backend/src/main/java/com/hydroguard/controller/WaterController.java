package com.hydroguard.controller;

import com.hydroguard.dto.WaterReadingRequest;
import com.hydroguard.model.SystemStatus;
import com.hydroguard.model.WaterReading;
import com.hydroguard.service.WaterLevelService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/water")
public class WaterController {
  private final WaterLevelService waterLevelService;

  public WaterController(WaterLevelService waterLevelService) {
    this.waterLevelService = waterLevelService;
  }

  @GetMapping("/history")
  public List<WaterReading> history() {
    return waterLevelService.history();
  }

  @PostMapping("/readings")
  public SystemStatus submitReading(@RequestBody WaterReadingRequest reading) {
    return waterLevelService.submitReading(reading);
  }
}
