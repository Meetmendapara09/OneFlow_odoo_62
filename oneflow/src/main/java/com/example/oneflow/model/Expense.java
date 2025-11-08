package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_number", unique = true, length = 50)
    private String expenseNumber;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Who submitted the expense

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    private String currency = "USD";

    @Column(nullable = false, length = 50)
    private String category; // Travel, Food, Supplies, Software, Other

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "receipt_path", length = 500)
    private String receiptPath; // File path or URL to receipt

    @Column(nullable = false, length = 20)
    private String status = "Draft"; // Draft, Submitted, Approved, Rejected, Reimbursed

    @Column(nullable = false)
    private Boolean billable = false; // Can be charged to customer

    @Column(name = "approved_by")
    private Long approvedBy; // User ID who approved

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (expenseNumber == null) {
            expenseNumber = "EXP-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
