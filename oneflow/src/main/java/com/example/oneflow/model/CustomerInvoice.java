package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "sales_order_id")
    private Long salesOrderId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "paid_amount", precision = 15, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(length = 10)
    private String currency = "USD";

    @Column(nullable = false, length = 20)
    private String paymentStatus = "Unpaid"; // Unpaid, Partial, Paid

    @Column(nullable = false, length = 20)
    private String status = "Draft"; // Draft, Sent, Paid, Cancelled

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "payment_terms", length = 255)
    private String paymentTerms;

    @OneToMany(mappedBy = "customerInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceLine> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (invoiceNumber == null) {
            invoiceNumber = "INV-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to calculate total from line items
    public void calculateTotal() {
        this.totalAmount = items.stream()
            .map(InvoiceLine::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Helper method to update payment status based on paid amount
    public void updatePaymentStatus() {
        if (paidAmount == null || paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.paymentStatus = "Unpaid";
        } else if (paidAmount.compareTo(totalAmount) >= 0) {
            this.paymentStatus = "Paid";
            this.status = "Paid";
        } else {
            this.paymentStatus = "Partial";
        }
    }

    // Helper method to get remaining amount
    public BigDecimal getRemainingAmount() {
        if (paidAmount == null) {
            return totalAmount;
        }
        return totalAmount.subtract(paidAmount);
    }
}
