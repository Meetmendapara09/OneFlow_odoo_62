package com.example.oneflow.service;

import com.example.oneflow.model.FinancialDocument;
import com.example.oneflow.repository.FinancialDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FinancialDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(FinancialDocumentService.class);

    @Autowired
    private FinancialDocumentRepository financialDocumentRepository;

    // Create document
    public FinancialDocument createDocument(FinancialDocument document) {
        logger.info("Creating {} document: {}", document.getDocumentType(), document.getDocumentNumber());

        // Generate document number if not provided
        if (document.getDocumentNumber() == null || document.getDocumentNumber().isEmpty()) {
            document.setDocumentNumber(generateDocumentNumber(document.getDocumentType()));
        }

        FinancialDocument saved = financialDocumentRepository.save(document);
        logger.info("Document created successfully. ID: {}, Number: {}, Amount: {}",
                    saved.getId(), saved.getDocumentNumber(), saved.getAmount());

        return saved;
    }

    // Generate document number
    private String generateDocumentNumber(FinancialDocument.DocumentType type) {
        String prefix;
        switch (type) {
            case SALES_ORDER: prefix = "SO"; break;
            case CUSTOMER_INVOICE: prefix = "INV"; break;
            case PURCHASE_ORDER: prefix = "PO"; break;
            case VENDOR_BILL: prefix = "BILL"; break;
            case EXPENSE: prefix = "EXP"; break;
            default: prefix = "DOC";
        }

        long count = financialDocumentRepository.count() + 1;
        return String.format("%s-%04d", prefix, count);
    }

    // Get all documents
    public List<FinancialDocument> getAllDocuments() {
        return financialDocumentRepository.findAll();
    }

    // Get document by ID
    public Optional<FinancialDocument> getDocumentById(Long id) {
        return financialDocumentRepository.findById(id);
    }

    // Get document by number
    public Optional<FinancialDocument> getDocumentByNumber(String documentNumber) {
        return financialDocumentRepository.findByDocumentNumber(documentNumber);
    }

    // Get documents by type
    public List<FinancialDocument> getDocumentsByType(FinancialDocument.DocumentType type) {
        return financialDocumentRepository.findByDocumentTypeOrderByDocumentDateDesc(type);
    }

    // Get documents by project
    public List<FinancialDocument> getDocumentsByProject(Long projectId) {
        return financialDocumentRepository.findByProjectIdOrderByDocumentDateDesc(projectId);
    }

    // Get documents by project and type
    public List<FinancialDocument> getDocumentsByProjectAndType(
            Long projectId, FinancialDocument.DocumentType type) {
        return financialDocumentRepository.findByProjectIdAndDocumentTypeOrderByDocumentDateDesc(
            projectId, type);
    }

    // Update document
    public FinancialDocument updateDocument(Long id, FinancialDocument documentDetails) {
        logger.info("Updating document ID: {}", id);

        return financialDocumentRepository.findById(id)
            .map(document -> {
                if (documentDetails.getAmount() != null) {
                    document.setAmount(documentDetails.getAmount());
                }
                if (documentDetails.getPaidAmount() != null) {
                    document.setPaidAmount(documentDetails.getPaidAmount());
                }
                if (documentDetails.getStatus() != null) {
                    document.setStatus(documentDetails.getStatus());
                }
                if (documentDetails.getDescription() != null) {
                    document.setDescription(documentDetails.getDescription());
                }
                if (documentDetails.getDueDate() != null) {
                    document.setDueDate(documentDetails.getDueDate());
                }

                document.updatePaymentStatus();

                FinancialDocument updated = financialDocumentRepository.save(document);
                logger.info("Document updated successfully");

                return updated;
            })
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    // Record payment
    public FinancialDocument recordPayment(Long id, BigDecimal paymentAmount) {
        logger.info("Recording payment of {} for document ID: {}", paymentAmount, id);

        return financialDocumentRepository.findById(id)
            .map(document -> {
                BigDecimal currentPaid = document.getPaidAmount() != null ?
                    document.getPaidAmount() : BigDecimal.ZERO;
                document.setPaidAmount(currentPaid.add(paymentAmount));
                document.updatePaymentStatus();

                FinancialDocument updated = financialDocumentRepository.save(document);
                logger.info("Payment recorded. Total paid: {}, Status: {}",
                           updated.getPaidAmount(), updated.getStatus());

                return updated;
            })
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    // Approve document
    public FinancialDocument approveDocument(Long id, String approverUsername) {
        logger.info("Approving document ID: {} by {}", id, approverUsername);

        return financialDocumentRepository.findById(id)
            .map(document -> {
                document.setStatus(FinancialDocument.Status.APPROVED);
                document.setApprovedBy(approverUsername);
                document.setApprovedAt(LocalDateTime.now());

                FinancialDocument approved = financialDocumentRepository.save(document);
                logger.info("Document approved successfully");

                return approved;
            })
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    // Cancel document
    public FinancialDocument cancelDocument(Long id) {
        logger.info("Cancelling document ID: {}", id);

        return financialDocumentRepository.findById(id)
            .map(document -> {
                document.setStatus(FinancialDocument.Status.CANCELLED);
                return financialDocumentRepository.save(document);
            })
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    // Delete document
    public void deleteDocument(Long id) {
        logger.info("Deleting document ID: {}", id);
        financialDocumentRepository.deleteById(id);
    }

    // Get project financials
    public ProjectFinancials getProjectFinancials(Long projectId) {
        logger.info("Calculating financials for project: {}", projectId);

        BigDecimal revenue = financialDocumentRepository.getTotalRevenueByProject(projectId);
        BigDecimal costs = financialDocumentRepository.getTotalCostsByProject(projectId);
        BigDecimal profit = financialDocumentRepository.getProjectProfit(projectId);

        revenue = revenue != null ? revenue : BigDecimal.ZERO;
        costs = costs != null ? costs : BigDecimal.ZERO;
        profit = profit != null ? profit : BigDecimal.ZERO;

        return new ProjectFinancials(revenue, costs, profit);
    }

    // Get outstanding invoices
    public List<FinancialDocument> getOutstandingInvoices() {
        return financialDocumentRepository.getOutstandingInvoices();
    }

    // Get outstanding bills
    public List<FinancialDocument> getOutstandingBills() {
        return financialDocumentRepository.getOutstandingBills();
    }

    // Get pending expenses
    public List<FinancialDocument> getPendingExpenses() {
        return financialDocumentRepository.getPendingExpenses();
    }

    // Get company financials
    public CompanyFinancials getCompanyFinancials() {
        logger.info("Calculating company-wide financials");

        BigDecimal totalRevenue = financialDocumentRepository.getTotalRevenue();
        BigDecimal totalCosts = financialDocumentRepository.getTotalCosts();

        totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        totalCosts = totalCosts != null ? totalCosts : BigDecimal.ZERO;
        BigDecimal totalProfit = totalRevenue.subtract(totalCosts);

        return new CompanyFinancials(totalRevenue, totalCosts, totalProfit);
    }

    // Helper classes for financial summaries
    public static class ProjectFinancials {
        public BigDecimal revenue;
        public BigDecimal costs;
        public BigDecimal profit;

        public ProjectFinancials(BigDecimal revenue, BigDecimal costs, BigDecimal profit) {
            this.revenue = revenue;
            this.costs = costs;
            this.profit = profit;
        }
    }

    public static class CompanyFinancials {
        public BigDecimal totalRevenue;
        public BigDecimal totalCosts;
        public BigDecimal totalProfit;

        public CompanyFinancials(BigDecimal totalRevenue, BigDecimal totalCosts, BigDecimal totalProfit) {
            this.totalRevenue = totalRevenue;
            this.totalCosts = totalCosts;
            this.totalProfit = totalProfit;
        }
    }
}

