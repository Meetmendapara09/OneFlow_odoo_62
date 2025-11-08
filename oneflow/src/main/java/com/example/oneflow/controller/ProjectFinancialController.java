package com.example.oneflow.controller;

import com.example.oneflow.service.ProjectFinancialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/financials")
@CrossOrigin(origins = "*")
public class ProjectFinancialController {

    @Autowired
    private ProjectFinancialService projectFinancialService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getFinancialSummary(@PathVariable Long projectId) {
        Map<String, Object> summary = projectFinancialService.getProjectFinancialSummary(projectId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/document-counts")
    public ResponseEntity<Map<String, Long>> getDocumentCounts(@PathVariable Long projectId) {
        Map<String, Long> counts = projectFinancialService.getProjectDocumentCounts(projectId);
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthIndicators(@PathVariable Long projectId) {
        Map<String, Object> health = projectFinancialService.getProjectHealthIndicators(projectId);
        return ResponseEntity.ok(health);
    }
}
