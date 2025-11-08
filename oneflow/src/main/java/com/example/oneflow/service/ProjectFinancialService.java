package com.example.oneflow.service;

import com.example.oneflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProjectFinancialService {

    @Autowired
    private CustomerInvoiceRepository customerInvoiceRepository;

    @Autowired
    private VendorBillRepository vendorBillRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    /**
     * Get comprehensive financial summary for a project
     * Formula: Profit = Revenue - Costs
     * Revenue = Customer Invoices (Sent/Paid)
     * Costs = Vendor Bills (Posted/Paid) + Approved Expenses + Timesheet Costs
     */
    public Map<String, Object> getProjectFinancialSummary(Long projectId) {
        Map<String, Object> summary = new HashMap<>();

        // Revenue Calculation
        BigDecimal invoicedRevenue = customerInvoiceRepository.getTotalInvoicedAmountByProject(projectId);
        invoicedRevenue = invoicedRevenue != null ? invoicedRevenue : BigDecimal.ZERO;

        BigDecimal paidRevenue = customerInvoiceRepository.getTotalPaidAmountByProject(projectId);
        paidRevenue = paidRevenue != null ? paidRevenue : BigDecimal.ZERO;

        BigDecimal outstandingRevenue = customerInvoiceRepository.getTotalOutstandingByProject(projectId);
        outstandingRevenue = outstandingRevenue != null ? outstandingRevenue : BigDecimal.ZERO;

        // Cost Calculation
        BigDecimal billsCost = vendorBillRepository.getTotalBillAmountByProject(projectId);
        billsCost = billsCost != null ? billsCost : BigDecimal.ZERO;

        BigDecimal expensesCost = expenseRepository.getTotalApprovedExpensesByProject(projectId);
        expensesCost = expensesCost != null ? expensesCost : BigDecimal.ZERO;

        BigDecimal timesheetCost = timesheetRepository.getTotalCostByProject(projectId);
        timesheetCost = timesheetCost != null ? timesheetCost : BigDecimal.ZERO;

        BigDecimal totalCost = billsCost.add(expensesCost).add(timesheetCost);

        // Profit Calculation
        BigDecimal profit = invoicedRevenue.subtract(totalCost);
        BigDecimal profitMargin = invoicedRevenue.compareTo(BigDecimal.ZERO) > 0
            ? profit.divide(invoicedRevenue, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100))
            : BigDecimal.ZERO;

        // Sales Orders Summary
        BigDecimal salesOrderRevenue = salesOrderRepository.getTotalRevenueByProject(projectId);
        salesOrderRevenue = salesOrderRevenue != null ? salesOrderRevenue : BigDecimal.ZERO;

        // Purchase Orders Summary
        BigDecimal purchaseOrderCost = purchaseOrderRepository.getTotalCostByProject(projectId);
        purchaseOrderCost = purchaseOrderCost != null ? purchaseOrderCost : BigDecimal.ZERO;

        // Billable vs Non-billable
        BigDecimal billableHours = timesheetRepository.getBillableHoursByProject(projectId);
        billableHours = billableHours != null ? billableHours : BigDecimal.ZERO;

        BigDecimal totalHours = timesheetRepository.getTotalHoursByProject(projectId);
        totalHours = totalHours != null ? totalHours : BigDecimal.ZERO;

        BigDecimal billableExpenses = expenseRepository.getTotalBillableExpensesByProject(projectId);
        billableExpenses = billableExpenses != null ? billableExpenses : BigDecimal.ZERO;

        // Build summary
        summary.put("projectId", projectId);

        // Revenue
        Map<String, BigDecimal> revenue = new HashMap<>();
        revenue.put("invoiced", invoicedRevenue);
        revenue.put("paid", paidRevenue);
        revenue.put("outstanding", outstandingRevenue);
        revenue.put("salesOrders", salesOrderRevenue);
        summary.put("revenue", revenue);

        // Costs
        Map<String, BigDecimal> costs = new HashMap<>();
        costs.put("bills", billsCost);
        costs.put("expenses", expensesCost);
        costs.put("timesheets", timesheetCost);
        costs.put("total", totalCost);
        costs.put("purchaseOrders", purchaseOrderCost);
        summary.put("costs", costs);

        // Profit
        Map<String, BigDecimal> profitData = new HashMap<>();
        profitData.put("amount", profit);
        profitData.put("margin", profitMargin);
        summary.put("profit", profitData);

        // Hours
        Map<String, BigDecimal> hours = new HashMap<>();
        hours.put("total", totalHours);
        hours.put("billable", billableHours);
        hours.put("nonBillable", totalHours.subtract(billableHours));
        summary.put("hours", hours);

        // Billable Summary
        Map<String, BigDecimal> billable = new HashMap<>();
        billable.put("hours", billableHours);
        billable.put("expenses", billableExpenses);
        summary.put("billable", billable);

        return summary;
    }

    /**
     * Get counts of documents linked to project
     */
    public Map<String, Long> getProjectDocumentCounts(Long projectId) {
        Map<String, Long> counts = new HashMap<>();

        counts.put("salesOrders", (long) salesOrderRepository.findByProjectId(projectId).size());
        counts.put("invoices", (long) customerInvoiceRepository.findByProjectId(projectId).size());
        counts.put("purchaseOrders", (long) purchaseOrderRepository.findByProjectId(projectId).size());
        counts.put("vendorBills", (long) vendorBillRepository.findByProjectId(projectId).size());
        counts.put("expenses", (long) expenseRepository.findByProjectId(projectId).size());
        counts.put("timesheets", (long) timesheetRepository.findByProjectId(projectId).size());

        return counts;
    }

    /**
     * Check project financial health
     */
    public Map<String, Object> getProjectHealthIndicators(Long projectId) {
        Map<String, Object> health = new HashMap<>();
        Map<String, Object> summary = getProjectFinancialSummary(projectId);

        @SuppressWarnings("unchecked")
        Map<String, BigDecimal> profitData = (Map<String, BigDecimal>) summary.get("profit");
        BigDecimal profitMargin = profitData.get("margin");

        @SuppressWarnings("unchecked")
        Map<String, BigDecimal> revenueData = (Map<String, BigDecimal>) summary.get("revenue");
        BigDecimal outstanding = revenueData.get("outstanding");
        BigDecimal invoiced = revenueData.get("invoiced");

        // Health indicators
        String profitHealth = profitMargin.compareTo(new BigDecimal(20)) >= 0 ? "Healthy" :
                             profitMargin.compareTo(BigDecimal.ZERO) >= 0 ? "Moderate" : "At Risk";

        String cashflowHealth = invoiced.compareTo(BigDecimal.ZERO) == 0 ? "Unknown" :
                               outstanding.divide(invoiced, 4, RoundingMode.HALF_UP)
                                   .compareTo(new BigDecimal(0.3)) <= 0 ? "Healthy" : "Needs Attention";

        health.put("profitHealth", profitHealth);
        health.put("cashflowHealth", cashflowHealth);
        health.put("profitMargin", profitMargin);
        health.put("outstandingRatio", invoiced.compareTo(BigDecimal.ZERO) > 0 
            ? outstanding.divide(invoiced, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100))
            : BigDecimal.ZERO);

        return health;
    }
}
