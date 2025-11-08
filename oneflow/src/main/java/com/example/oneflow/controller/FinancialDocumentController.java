package com.example.oneflow.controller;

import com.example.oneflow.model.FinancialDocument;
import com.example.oneflow.service.FinancialDocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial-documents")
@CrossOrigin(origins = "*")
public class FinancialDocumentController {

    private static final Logger logger = LoggerFactory.getLogger(FinancialDocumentController.class);

    @Autowired
    private FinancialDocumentService financialDocumentService;

    // Get all documents
    @GetMapping
    public ResponseEntity<List<FinancialDocument>> getAllDocuments() {
        logger.info("GET /api/financial-documents - Fetching all documents");
        List<FinancialDocument> documents = financialDocumentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    // Get document by ID
    @GetMapping("/{id}")
    public ResponseEntity<FinancialDocument> getDocumentById(@PathVariable Long id) {
        logger.info("GET /api/financial-documents/{}", id);
        return financialDocumentService.getDocumentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Get documents by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<FinancialDocument>> getDocumentsByType(@PathVariable String type) {
        logger.info("GET /api/financial-documents/type/{}", type);
        try {
            FinancialDocument.DocumentType docType = FinancialDocument.DocumentType.valueOf(type.toUpperCase());
            List<FinancialDocument> documents = financialDocumentService.getDocumentsByType(docType);
            return ResponseEntity.ok(documents);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid document type: {}", type);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get documents by project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FinancialDocument>> getDocumentsByProject(@PathVariable Long projectId) {
        logger.info("GET /api/financial-documents/project/{}", projectId);
        List<FinancialDocument> documents = financialDocumentService.getDocumentsByProject(projectId);
        return ResponseEntity.ok(documents);
    }

    // Create document
    @PostMapping
    public ResponseEntity<FinancialDocument> createDocument(
            @RequestBody FinancialDocument document,
            Authentication authentication) {
        logger.info("POST /api/financial-documents - Creating {} document", document.getDocumentType());

        // Set creator
        document.setCreatedBy(authentication.getName());

        try {
            FinancialDocument created = financialDocumentService.createDocument(document);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            logger.error("Error creating document: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update document
    @PutMapping("/{id}")
    public ResponseEntity<FinancialDocument> updateDocument(
            @PathVariable Long id,
            @RequestBody FinancialDocument document) {
        logger.info("PUT /api/financial-documents/{}", id);
        try {
            FinancialDocument updated = financialDocumentService.updateDocument(id, document);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Error updating document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Record payment
    @PostMapping("/{id}/payment")
    public ResponseEntity<FinancialDocument> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> payment) {
        logger.info("POST /api/financial-documents/{}/payment", id);
        try {
            BigDecimal amount = payment.get("amount");
            FinancialDocument updated = financialDocumentService.recordPayment(id, amount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Error recording payment: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Approve document
    @PutMapping("/{id}/approve")
    public ResponseEntity<FinancialDocument> approveDocument(
            @PathVariable Long id,
            Authentication authentication) {
        String approverUsername = authentication.getName();
        logger.info("PUT /api/financial-documents/{}/approve by {}", id, approverUsername);
        try {
            FinancialDocument approved = financialDocumentService.approveDocument(id, approverUsername);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            logger.error("Error approving document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Cancel document
    @PutMapping("/{id}/cancel")
    public ResponseEntity<FinancialDocument> cancelDocument(@PathVariable Long id) {
        logger.info("PUT /api/financial-documents/{}/cancel", id);
        try {
            FinancialDocument cancelled = financialDocumentService.cancelDocument(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            logger.error("Error cancelling document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Delete document
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        logger.info("DELETE /api/financial-documents/{}", id);
        try {
            financialDocumentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Get project financials
    @GetMapping("/project/{projectId}/financials")
    public ResponseEntity<Map<String, Object>> getProjectFinancials(@PathVariable Long projectId) {
        logger.info("GET /api/financial-documents/project/{}/financials", projectId);

        FinancialDocumentService.ProjectFinancials financials =
            financialDocumentService.getProjectFinancials(projectId);

        Map<String, Object> response = new HashMap<>();
        response.put("revenue", financials.revenue);
        response.put("costs", financials.costs);
        response.put("profit", financials.profit);

        return ResponseEntity.ok(response);
    }

    // Get outstanding invoices
    @GetMapping("/invoices/outstanding")
    public ResponseEntity<List<FinancialDocument>> getOutstandingInvoices() {
        logger.info("GET /api/financial-documents/invoices/outstanding");
        List<FinancialDocument> invoices = financialDocumentService.getOutstandingInvoices();
        return ResponseEntity.ok(invoices);
    }

    // Get outstanding bills
    @GetMapping("/bills/outstanding")
    public ResponseEntity<List<FinancialDocument>> getOutstandingBills() {
        logger.info("GET /api/financial-documents/bills/outstanding");
        List<FinancialDocument> bills = financialDocumentService.getOutstandingBills();
        return ResponseEntity.ok(bills);
    }

    // Get pending expenses
    @GetMapping("/expenses/pending")
    public ResponseEntity<List<FinancialDocument>> getPendingExpenses() {
        logger.info("GET /api/financial-documents/expenses/pending");
        List<FinancialDocument> expenses = financialDocumentService.getPendingExpenses();
        return ResponseEntity.ok(expenses);
    }

    // Get company financials
    @GetMapping("/company/financials")
    public ResponseEntity<Map<String, Object>> getCompanyFinancials() {
        logger.info("GET /api/financial-documents/company/financials");

        FinancialDocumentService.CompanyFinancials financials =
            financialDocumentService.getCompanyFinancials();

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", financials.totalRevenue);
        response.put("totalCosts", financials.totalCosts);
        response.put("totalProfit", financials.totalProfit);

        return ResponseEntity.ok(response);
    }

    // Specialized endpoints for different document types

    // Sales Orders
    @GetMapping("/sales-orders")
    public ResponseEntity<List<FinancialDocument>> getSalesOrders() {
        return getDocumentsByType("SALES_ORDER");
    }

    // Customer Invoices
    @GetMapping("/customer-invoices")
    public ResponseEntity<List<FinancialDocument>> getCustomerInvoices() {
        return getDocumentsByType("CUSTOMER_INVOICE");
    }

    // Purchase Orders
    @GetMapping("/purchase-orders")
    public ResponseEntity<List<FinancialDocument>> getPurchaseOrders() {
        return getDocumentsByType("PURCHASE_ORDER");
    }

    // Vendor Bills
    @GetMapping("/vendor-bills")
    public ResponseEntity<List<FinancialDocument>> getVendorBills() {
        return getDocumentsByType("VENDOR_BILL");
    }

    // Expenses
    @GetMapping("/expenses")
    public ResponseEntity<List<FinancialDocument>> getExpenses() {
        return getDocumentsByType("EXPENSE");
    }
}

