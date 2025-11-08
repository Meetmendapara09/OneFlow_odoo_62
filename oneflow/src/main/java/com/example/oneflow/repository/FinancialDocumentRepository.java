package com.example.oneflow.repository;

import com.example.oneflow.model.FinancialDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialDocumentRepository extends JpaRepository<FinancialDocument, Long> {

    // Find by document number
    Optional<FinancialDocument> findByDocumentNumber(String documentNumber);

    // Find by type
    List<FinancialDocument> findByDocumentTypeOrderByDocumentDateDesc(
        FinancialDocument.DocumentType documentType
    );

    // Find by project
    List<FinancialDocument> findByProjectIdOrderByDocumentDateDesc(Long projectId);

    // Find by project and type
    List<FinancialDocument> findByProjectIdAndDocumentTypeOrderByDocumentDateDesc(
        Long projectId, FinancialDocument.DocumentType documentType
    );

    // Find by status
    List<FinancialDocument> findByStatusOrderByDocumentDateDesc(FinancialDocument.Status status);

    // Find by employee (for expenses)
    List<FinancialDocument> findByEmployeeUsernameOrderByDocumentDateDesc(String username);

    // Find by customer
    List<FinancialDocument> findByCustomerNameOrderByDocumentDateDesc(String customerName);

    // Find by vendor
    List<FinancialDocument> findByVendorNameOrderByDocumentDateDesc(String vendorName);

    // Find by date range
    List<FinancialDocument> findByDocumentDateBetweenOrderByDocumentDateDesc(
        LocalDate startDate, LocalDate endDate
    );

    // Get total revenue by project (Sales Orders + Customer Invoices)
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.projectId = :projectId " +
           "AND fd.documentType IN ('SALES_ORDER', 'CUSTOMER_INVOICE')")
    BigDecimal getTotalRevenueByProject(@Param("projectId") Long projectId);

    // Get total costs by project (POs + Vendor Bills + Expenses)
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.projectId = :projectId " +
           "AND fd.documentType IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')")
    BigDecimal getTotalCostsByProject(@Param("projectId") Long projectId);

    // Get project profit (Revenue - Costs)
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN fd.documentType IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN fd.amount ELSE 0 END), 0) - " +
           "COALESCE(SUM(CASE WHEN fd.documentType IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN fd.amount ELSE 0 END), 0) " +
           "FROM FinancialDocument fd WHERE fd.projectId = :projectId")
    BigDecimal getProjectProfit(@Param("projectId") Long projectId);

    // Get outstanding invoices
    @Query("SELECT fd FROM FinancialDocument fd " +
           "WHERE fd.documentType = 'CUSTOMER_INVOICE' " +
           "AND fd.status IN ('APPROVED', 'PARTIALLY_PAID') " +
           "ORDER BY fd.dueDate ASC")
    List<FinancialDocument> getOutstandingInvoices();

    // Get outstanding bills
    @Query("SELECT fd FROM FinancialDocument fd " +
           "WHERE fd.documentType = 'VENDOR_BILL' " +
           "AND fd.status IN ('APPROVED', 'PARTIALLY_PAID') " +
           "ORDER BY fd.dueDate ASC")
    List<FinancialDocument> getOutstandingBills();

    // Get pending expenses for approval
    @Query("SELECT fd FROM FinancialDocument fd " +
           "WHERE fd.documentType = 'EXPENSE' " +
           "AND fd.status = 'PENDING' " +
           "ORDER BY fd.documentDate DESC")
    List<FinancialDocument> getPendingExpenses();

    // Get total revenue
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.documentType IN ('SALES_ORDER', 'CUSTOMER_INVOICE')")
    BigDecimal getTotalRevenue();

    // Get total costs
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.documentType IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')")
    BigDecimal getTotalCosts();

    // Get revenue by date range
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.documentType IN ('SALES_ORDER', 'CUSTOMER_INVOICE') " +
           "AND fd.documentDate BETWEEN :startDate AND :endDate")
    BigDecimal getRevenueByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Get costs by date range
    @Query("SELECT SUM(fd.amount) FROM FinancialDocument fd " +
           "WHERE fd.documentType IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') " +
           "AND fd.documentDate BETWEEN :startDate AND :endDate")
    BigDecimal getCostsByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}

