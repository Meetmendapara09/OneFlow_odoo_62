package com.example.oneflow.controller;

import com.example.oneflow.model.Expense;
import com.example.oneflow.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Optional<Expense> expense = expenseService.getExpenseById(id);
        return expense.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getExpensesByUser(userId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Expense>> getExpensesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getExpensesByProject(projectId));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Expense>> getExpensesByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(expenseService.getExpensesByTask(taskId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Expense>> getExpensesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(expenseService.getExpensesByStatus(status));
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<Expense>> getPendingApprovals() {
        return ResponseEntity.ok(expenseService.getPendingApprovals());
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense created = expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expenseDetails) {
        try {
            Expense updated = expenseService.updateExpense(id, expenseDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Expense> submitExpense(@PathVariable Long id) {
        try {
            Expense submitted = expenseService.submitExpense(id);
            return ResponseEntity.ok(submitted);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Expense> approveExpense(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long approverId = request.get("approverId");
            Expense approved = expenseService.approveExpense(id, approverId);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long approverId = ((Number) request.get("approverId")).longValue();
            String reason = (String) request.get("reason");
            Expense rejected = expenseService.rejectExpense(id, approverId, reason);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/reimburse")
    public ResponseEntity<Expense> markAsReimbursed(@PathVariable Long id) {
        try {
            Expense reimbursed = expenseService.markAsReimbursed(id);
            return ResponseEntity.ok(reimbursed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/total")
    public ResponseEntity<BigDecimal> getTotalApprovedExpensesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getTotalApprovedExpensesByProject(projectId));
    }

    @GetMapping("/project/{projectId}/billable")
    public ResponseEntity<BigDecimal> getTotalBillableExpensesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getTotalBillableExpensesByProject(projectId));
    }

    @GetMapping("/project/{projectId}/non-billable")
    public ResponseEntity<BigDecimal> getTotalNonBillableExpensesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getTotalNonBillableExpensesByProject(projectId));
    }
}
