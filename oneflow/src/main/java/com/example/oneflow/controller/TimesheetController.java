package com.example.oneflow.controller;

import com.example.oneflow.model.Timesheet;
import com.example.oneflow.service.TimesheetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timesheets")
@CrossOrigin(origins = "*")
public class TimesheetController {

    private static final Logger logger = LoggerFactory.getLogger(TimesheetController.class);

    @Autowired
    private TimesheetService timesheetService;

    // Get all timesheets
    @GetMapping
    public ResponseEntity<List<Timesheet>> getAllTimesheets() {
        logger.info("GET /api/timesheets - Fetching all timesheets");
        List<Timesheet> timesheets = timesheetService.getAllTimesheets();
        return ResponseEntity.ok(timesheets);
    }

    // Get timesheet by ID
    @GetMapping("/{id}")
    public ResponseEntity<Timesheet> getTimesheetById(@PathVariable Long id) {
        logger.info("GET /api/timesheets/{} - Fetching timesheet", id);
        return timesheetService.getTimesheetById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Get timesheets by employee
    @GetMapping("/employee/{username}")
    public ResponseEntity<List<Timesheet>> getTimesheetsByEmployee(@PathVariable String username) {
        logger.info("GET /api/timesheets/employee/{} - Fetching employee timesheets", username);
        List<Timesheet> timesheets = timesheetService.getTimesheetsByEmployee(username);
        return ResponseEntity.ok(timesheets);
    }

    // Get my timesheets (current authenticated user)
    @GetMapping("/my")
    public ResponseEntity<List<Timesheet>> getMyTimesheets(Authentication authentication) {
        String username = authentication.getName();
        logger.info("GET /api/timesheets/my - Fetching timesheets for user: {}", username);
        List<Timesheet> timesheets = timesheetService.getTimesheetsByEmployee(username);
        return ResponseEntity.ok(timesheets);
    }

    // Get timesheets by task
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Timesheet>> getTimesheetsByTask(@PathVariable Long taskId) {
        logger.info("GET /api/timesheets/task/{} - Fetching task timesheets", taskId);
        List<Timesheet> timesheets = timesheetService.getTimesheetsByTask(taskId);
        return ResponseEntity.ok(timesheets);
    }

    // Get timesheets by project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Timesheet>> getTimesheetsByProject(@PathVariable Long projectId) {
        logger.info("GET /api/timesheets/project/{} - Fetching project timesheets", projectId);
        List<Timesheet> timesheets = timesheetService.getTimesheetsByProject(projectId);
        return ResponseEntity.ok(timesheets);
    }

    // Get timesheets by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<Timesheet>> getTimesheetsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        logger.info("GET /api/timesheets/date-range - From {} to {}", startDate, endDate);
        List<Timesheet> timesheets = timesheetService.getTimesheetsByDateRange(startDate, endDate);
        return ResponseEntity.ok(timesheets);
    }

    // Get timesheets by billing status
    @GetMapping("/billing-status/{status}")
    public ResponseEntity<List<Timesheet>> getTimesheetsByBillingStatus(@PathVariable String status) {
        logger.info("GET /api/timesheets/billing-status/{}", status);
        try {
            Timesheet.BillingStatus billingStatus = Timesheet.BillingStatus.valueOf(status.toUpperCase());
            List<Timesheet> timesheets = timesheetService.getTimesheetsByBillingStatus(billingStatus);
            return ResponseEntity.ok(timesheets);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid billing status: {}", status);
            return ResponseEntity.badRequest().build();
        }
    }

    // Create timesheet
    @PostMapping
    public ResponseEntity<Timesheet> createTimesheet(@RequestBody Timesheet timesheet, Authentication authentication) {
        logger.info("POST /api/timesheets - Creating timesheet for employee: {}", timesheet.getEmployeeUsername());

        // If employee username not provided, use authenticated user
        if (timesheet.getEmployeeUsername() == null || timesheet.getEmployeeUsername().isEmpty()) {
            timesheet.setEmployeeUsername(authentication.getName());
        }

        try {
            Timesheet created = timesheetService.createTimesheet(timesheet);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            logger.error("Error creating timesheet: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update timesheet
    @PutMapping("/{id}")
    public ResponseEntity<Timesheet> updateTimesheet(@PathVariable Long id, @RequestBody Timesheet timesheet) {
        logger.info("PUT /api/timesheets/{} - Updating timesheet", id);
        try {
            Timesheet updated = timesheetService.updateTimesheet(id, timesheet);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Error updating timesheet: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Approve timesheet
    @PutMapping("/{id}/approve")
    public ResponseEntity<Timesheet> approveTimesheet(@PathVariable Long id, Authentication authentication) {
        String approverUsername = authentication.getName();
        logger.info("PUT /api/timesheets/{}/approve - Approving by {}", id, approverUsername);
        try {
            Timesheet approved = timesheetService.approveTimesheet(id, approverUsername);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            logger.error("Error approving timesheet: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Delete timesheet
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimesheet(@PathVariable Long id) {
        logger.info("DELETE /api/timesheets/{} - Deleting timesheet", id);
        try {
            timesheetService.deleteTimesheet(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting timesheet: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        logger.info("GET /api/timesheets/stats - Fetching timesheet statistics");

        Map<String, Object> stats = new HashMap<>();
        List<Object[]> billingTotals = timesheetService.getBillingStatusTotals();

        for (Object[] row : billingTotals) {
            Timesheet.BillingStatus status = (Timesheet.BillingStatus) row[0];
            Double total = (Double) row[1];
            stats.put(status.name().toLowerCase() + "_total", total);
        }

        return ResponseEntity.ok(stats);
    }

    // Get employee total hours
    @GetMapping("/employee/{username}/total-hours")
    public ResponseEntity<Map<String, Double>> getEmployeeTotalHours(@PathVariable String username) {
        logger.info("GET /api/timesheets/employee/{}/total-hours", username);
        Double totalHours = timesheetService.getTotalHoursByEmployee(username);
        Map<String, Double> response = new HashMap<>();
        response.put("totalHours", totalHours);
        return ResponseEntity.ok(response);
    }

    // Get project total cost
    @GetMapping("/project/{projectId}/total-cost")
    public ResponseEntity<Map<String, Double>> getProjectTotalCost(@PathVariable Long projectId) {
        logger.info("GET /api/timesheets/project/{}/total-cost", projectId);
        Double totalCost = timesheetService.getTotalCostByProject(projectId);
        Map<String, Double> response = new HashMap<>();
        response.put("totalCost", totalCost);
        return ResponseEntity.ok(response);
    }
}

