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
@Table(name = "vendor_bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", unique = true, nullable = false, length = 50)
    private String billNumber;

    @Column(name = "purchase_order_id")
    private Long purchaseOrderId;

    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;

    @Column(name = "vendor_name", nullable = false, length = 255)
    private String vendorName;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

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
    private String status = "Draft"; // Draft, Posted, Paid, Cancelled

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "vendorBill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillLine> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (billNumber == null) {
            billNumber = "BILL-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to calculate total from line items
    public void calculateTotal() {
        this.totalAmount = items.stream()
            .map(BillLine::getSubtotal)
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
