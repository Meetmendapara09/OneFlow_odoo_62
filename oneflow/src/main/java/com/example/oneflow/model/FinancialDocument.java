package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_documents", indexes = {
    @Index(name = "idx_doc_type", columnList = "document_type"),
    @Index(name = "idx_project_id", columnList = "project_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_doc_date", columnList = "document_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentType documentType;

    @Column(name = "document_number", unique = true, length = 100)
    private String documentNumber; // SO-001, INV-001, PO-001, etc.

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "project_name", length = 255)
    private String projectName;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    @Column(name = "vendor_name", length = 255)
    private String vendorName;

    @Column(name = "employee_username", length = 255)
    private String employeeUsername; // For expenses

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.DRAFT;

    @Column(name = "document_date", nullable = false)
    private LocalDate documentDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "milestone_name", length = 255)
    private String milestoneName; // For milestone-based invoicing

    @Column(name = "is_billable")
    private Boolean isBillable = false; // For expenses

    @Column(name = "receipt_url", length = 500)
    private String receiptUrl; // For expenses

    @Column(name = "approved_by", length = 255)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Document Types
    public enum DocumentType {
        SALES_ORDER,      // Customer purchase - Revenue expectation
        CUSTOMER_INVOICE, // Bill to customer - Revenue recognition
        PURCHASE_ORDER,   // Order to vendor - Cost expectation
        VENDOR_BILL,      // Bill from vendor - Cost recognition
        EXPENSE           // Team member expense - Cost recognition
    }

    // Document Status
    public enum Status {
        DRAFT,           // Being created
        PENDING,         // Awaiting approval
        APPROVED,        // Approved but not paid
        PARTIALLY_PAID,  // Partially paid
        PAID,            // Fully paid
        CANCELLED        // Cancelled
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (documentDate == null) {
            documentDate = LocalDate.now();
        }
        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updatePaymentStatus();
    }

    // Auto-update status based on payment
    public void updatePaymentStatus() {
        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }

        if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            if (status == Status.PAID || status == Status.PARTIALLY_PAID) {
                status = Status.APPROVED;
            }
        } else if (paidAmount.compareTo(amount) >= 0) {
            status = Status.PAID;
        } else {
            status = Status.PARTIALLY_PAID;
        }
    }

    // Check if document is revenue (positive cash flow)
    @Transient
    public boolean isRevenue() {
        return documentType == DocumentType.SALES_ORDER ||
               documentType == DocumentType.CUSTOMER_INVOICE;
    }

    // Check if document is cost (negative cash flow)
    @Transient
    public boolean isCost() {
        return documentType == DocumentType.PURCHASE_ORDER ||
               documentType == DocumentType.VENDOR_BILL ||
               documentType == DocumentType.EXPENSE;
    }

    // Get outstanding amount
    @Transient
    public BigDecimal getOutstandingAmount() {
        return amount.subtract(paidAmount);
    }

    // For backward compatibility with String ID in frontend
    @Transient
    public String getStringId() {
        return id != null ? documentType.name().substring(0, 2).toLowerCase() + id : null;
    }
}

