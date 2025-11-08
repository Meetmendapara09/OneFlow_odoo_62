package com.example.oneflow.service;

import com.example.oneflow.model.Expense;
import com.example.oneflow.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getExpensesByProject(Long projectId) {
        return expenseRepository.findByProjectId(projectId);
    }

    public List<Expense> getExpensesByTask(Long taskId) {
        return expenseRepository.findByTaskId(taskId);
    }

    public List<Expense> getExpensesByStatus(String status) {
        return expenseRepository.findByStatus(status);
    }

    public List<Expense> getPendingApprovals() {
        return expenseRepository.findPendingApprovals();
    }

    public Expense createExpense(Expense expense) {
        expense.setStatus("Draft");
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expenseDetails) {
        return expenseRepository.findById(id).map(expense -> {
            if (expenseDetails.getExpenseDate() != null) expense.setExpenseDate(expenseDetails.getExpenseDate());
            if (expenseDetails.getAmount() != null) expense.setAmount(expenseDetails.getAmount());
            if (expenseDetails.getCategory() != null) expense.setCategory(expenseDetails.getCategory());
            if (expenseDetails.getDescription() != null) expense.setDescription(expenseDetails.getDescription());
            if (expenseDetails.getBillable() != null) expense.setBillable(expenseDetails.getBillable());
            if (expenseDetails.getReceiptPath() != null) expense.setReceiptPath(expenseDetails.getReceiptPath());
            if (expenseDetails.getProjectId() != null) expense.setProjectId(expenseDetails.getProjectId());
            if (expenseDetails.getTaskId() != null) expense.setTaskId(expenseDetails.getTaskId());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense submitExpense(Long id) {
        return expenseRepository.findById(id).map(expense -> {
            if (!"Draft".equals(expense.getStatus())) {
                throw new RuntimeException("Only draft expenses can be submitted");
            }
            expense.setStatus("Submitted");
            expense.setSubmittedDate(LocalDateTime.now());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    public Expense approveExpense(Long id, Long approverId) {
        return expenseRepository.findById(id).map(expense -> {
            if (!"Submitted".equals(expense.getStatus())) {
                throw new RuntimeException("Only submitted expenses can be approved");
            }
            expense.setStatus("Approved");
            expense.setApprovedBy(approverId);
            expense.setApprovedDate(LocalDateTime.now());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    public Expense rejectExpense(Long id, Long approverId, String reason) {
        return expenseRepository.findById(id).map(expense -> {
            if (!"Submitted".equals(expense.getStatus())) {
                throw new RuntimeException("Only submitted expenses can be rejected");
            }
            expense.setStatus("Rejected");
            expense.setApprovedBy(approverId);
            expense.setRejectionReason(reason);
            expense.setApprovedDate(LocalDateTime.now());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    public Expense markAsReimbursed(Long id) {
        return expenseRepository.findById(id).map(expense -> {
            if (!"Approved".equals(expense.getStatus())) {
                throw new RuntimeException("Only approved expenses can be marked as reimbursed");
            }
            expense.setStatus("Reimbursed");
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    // Statistical methods
    public BigDecimal getTotalApprovedExpensesByProject(Long projectId) {
        BigDecimal total = expenseRepository.getTotalApprovedExpensesByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalBillableExpensesByProject(Long projectId) {
        BigDecimal total = expenseRepository.getTotalBillableExpensesByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalNonBillableExpensesByProject(Long projectId) {
        BigDecimal total = expenseRepository.getTotalNonBillableExpensesByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }
}
