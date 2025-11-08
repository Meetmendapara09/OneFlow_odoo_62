package com.example.oneflow.service;

import com.example.oneflow.model.Timesheet;
import com.example.oneflow.model.User;
import com.example.oneflow.repository.TimesheetRepository;
import com.example.oneflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TimesheetService {

    private static final Logger logger = LoggerFactory.getLogger(TimesheetService.class);

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private UserRepository userRepository;

    // Create timesheet
    public Timesheet createTimesheet(Timesheet timesheet) {
        logger.info("Creating timesheet for employee: {}", timesheet.getEmployeeUsername());

        // Get user's hourly rate if not provided
        if (timesheet.getHourlyRate() == null) {
            Optional<User> user = userRepository.findByUsername(timesheet.getEmployeeUsername());
            if (user.isPresent() && user.get().getHourlyRate() != null) {
                timesheet.setHourlyRate(user.get().getHourlyRate());
                logger.info("Using user's hourly rate: {}", user.get().getHourlyRate());
            } else {
                // Default hourly rate if not set
                timesheet.setHourlyRate(new BigDecimal("50.00"));
                logger.warn("No hourly rate found for user, using default: 50.00");
            }
        }

        // Calculate total cost
        timesheet.calculateTotalCost();

        Timesheet saved = timesheetRepository.save(timesheet);
        logger.info("Timesheet created successfully. ID: {}, Total Cost: {}", saved.getId(), saved.getTotalCost());

        return saved;
    }

    // Get all timesheets
    public List<Timesheet> getAllTimesheets() {
        logger.info("Fetching all timesheets");
        return timesheetRepository.findAll();
    }

    // Get timesheet by ID
    public Optional<Timesheet> getTimesheetById(Long id) {
        logger.info("Fetching timesheet by ID: {}", id);
        return timesheetRepository.findById(id);
    }

    // Get timesheets by employee
    public List<Timesheet> getTimesheetsByEmployee(String username) {
        logger.info("Fetching timesheets for employee: {}", username);
        return timesheetRepository.findByEmployeeUsernameOrderByWorkDateDesc(username);
    }

    // Get timesheets by task
    public List<Timesheet> getTimesheetsByTask(Long taskId) {
        logger.info("Fetching timesheets for task: {}", taskId);
        return timesheetRepository.findByTaskIdOrderByWorkDateDesc(taskId);
    }

    // Get timesheets by project
    public List<Timesheet> getTimesheetsByProject(Long projectId) {
        logger.info("Fetching timesheets for project: {}", projectId);
        return timesheetRepository.findByProjectIdOrderByWorkDateDesc(projectId);
    }

    // Get timesheets by date range
    public List<Timesheet> getTimesheetsByDateRange(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching timesheets from {} to {}", startDate, endDate);
        return timesheetRepository.findByWorkDateBetweenOrderByWorkDateDesc(startDate, endDate);
    }

    // Get timesheets by billing status
    public List<Timesheet> getTimesheetsByBillingStatus(Timesheet.BillingStatus status) {
        logger.info("Fetching timesheets with billing status: {}", status);
        return timesheetRepository.findByBillingStatusOrderByWorkDateDesc(status);
    }

    // Update timesheet
    public Timesheet updateTimesheet(Long id, Timesheet timesheetDetails) {
        logger.info("Updating timesheet ID: {}", id);

        return timesheetRepository.findById(id)
            .map(timesheet -> {
                if (timesheetDetails.getHoursWorked() != null) {
                    timesheet.setHoursWorked(timesheetDetails.getHoursWorked());
                }
                if (timesheetDetails.getHourlyRate() != null) {
                    timesheet.setHourlyRate(timesheetDetails.getHourlyRate());
                }
                if (timesheetDetails.getBillingStatus() != null) {
                    timesheet.setBillingStatus(timesheetDetails.getBillingStatus());
                }
                if (timesheetDetails.getDescription() != null) {
                    timesheet.setDescription(timesheetDetails.getDescription());
                }
                if (timesheetDetails.getTaskId() != null) {
                    timesheet.setTaskId(timesheetDetails.getTaskId());
                }
                if (timesheetDetails.getTaskTitle() != null) {
                    timesheet.setTaskTitle(timesheetDetails.getTaskTitle());
                }
                if (timesheetDetails.getProjectId() != null) {
                    timesheet.setProjectId(timesheetDetails.getProjectId());
                }
                if (timesheetDetails.getProjectName() != null) {
                    timesheet.setProjectName(timesheetDetails.getProjectName());
                }

                timesheet.calculateTotalCost();

                Timesheet updated = timesheetRepository.save(timesheet);
                logger.info("Timesheet updated successfully. New total cost: {}", updated.getTotalCost());

                return updated;
            })
            .orElseThrow(() -> new RuntimeException("Timesheet not found with id: " + id));
    }

    // Approve timesheet
    public Timesheet approveTimesheet(Long id, String approverUsername) {
        logger.info("Approving timesheet ID: {} by {}", id, approverUsername);

        return timesheetRepository.findById(id)
            .map(timesheet -> {
                timesheet.setBillingStatus(Timesheet.BillingStatus.APPROVED);
                timesheet.setApprovedBy(approverUsername);
                timesheet.setApprovedAt(java.time.LocalDateTime.now());

                Timesheet approved = timesheetRepository.save(timesheet);
                logger.info("Timesheet approved successfully");

                return approved;
            })
            .orElseThrow(() -> new RuntimeException("Timesheet not found with id: " + id));
    }

    // Delete timesheet
    public void deleteTimesheet(Long id) {
        logger.info("Deleting timesheet ID: {}", id);
        timesheetRepository.deleteById(id);
        logger.info("Timesheet deleted successfully");
    }

    // Get total hours by employee
    public Double getTotalHoursByEmployee(String username) {
        logger.info("Calculating total hours for employee: {}", username);
        Double total = timesheetRepository.getTotalHoursByEmployee(username);
        return total != null ? total : 0.0;
    }

    // Get total cost by project
    public Double getTotalCostByProject(Long projectId) {
        logger.info("Calculating total cost for project: {}", projectId);
        Double total = timesheetRepository.getTotalCostByProject(projectId);
        return total != null ? total : 0.0;
    }

    // Get billing status totals
    public List<Object[]> getBillingStatusTotals() {
        logger.info("Fetching billing status totals");
        return timesheetRepository.getBillingStatusTotals();
    }
}

