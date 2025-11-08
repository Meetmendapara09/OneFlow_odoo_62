package com.example.oneflow.repository;

import com.example.oneflow.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByUserId(Long userId);
    
    List<Expense> findByProjectId(Long projectId);
    
    List<Expense> findByTaskId(Long taskId);
    
    List<Expense> findByStatus(String status);
    
    List<Expense> findByUserIdAndStatus(Long userId, String status);
    
    @Query("SELECT e FROM Expense e WHERE e.projectId = :projectId AND e.status = :status")
    List<Expense> findByProjectIdAndStatus(
        @Param("projectId") Long projectId, 
        @Param("status") String status
    );
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.projectId = :projectId AND e.status = 'Approved'")
    BigDecimal getTotalApprovedExpensesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.projectId = :projectId AND e.billable = true AND e.status = 'Approved'")
    BigDecimal getTotalBillableExpensesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.projectId = :projectId AND e.billable = false AND e.status = 'Approved'")
    BigDecimal getTotalNonBillableExpensesByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT e FROM Expense e WHERE e.status = 'Submitted' ORDER BY e.submittedDate ASC")
    List<Expense> findPendingApprovals();
}
