package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "timesheets", indexes = {
    @Index(name = "idx_employee", columnList = "employee_username"),
    @Index(name = "idx_task_id", columnList = "task_id"),
    @Index(name = "idx_date", columnList = "work_date"),
    @Index(name = "idx_status", columnList = "billing_status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_username", nullable = false, length = 255)
    private String employeeUsername;

    @Column(name = "employee_name", nullable = false, length = 255)
    private String employeeName;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "task_title", length = 255)
    private String taskTitle;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "project_name", length = 255)
    private String projectName;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(name = "hours_worked", nullable = false, precision = 10, scale = 2)
    private BigDecimal hoursWorked;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost; // hoursWorked * hourlyRate

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_status", nullable = false, length = 20)
    private BillingStatus billingStatus = BillingStatus.NON_BILLED;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "session_start")
    private LocalDateTime sessionStart;

    @Column(name = "session_end")
    private LocalDateTime sessionEnd;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved_by", length = 255)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    public enum BillingStatus {
        BILLED,      // Charged to client/project
        NON_BILLED,  // Internal work, not charged
        PENDING,     // Awaiting approval
        APPROVED     // Approved for billing
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateTotalCost();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotalCost();
    }

    // Calculate total cost automatically
    public void calculateTotalCost() {
        if (hoursWorked != null && hourlyRate != null) {
            this.totalCost = hoursWorked.multiply(hourlyRate);
        }
    }

    // For backward compatibility with String ID in frontend
    @Transient
    public String getStringId() {
        return id != null ? "ts" + id : null;
    }
}

