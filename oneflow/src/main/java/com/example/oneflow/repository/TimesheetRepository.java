package com.example.oneflow.repository;

import com.example.oneflow.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    // Find by employee
    List<Timesheet> findByEmployeeUsernameOrderByWorkDateDesc(String employeeUsername);

    // Find by task
    List<Timesheet> findByTaskIdOrderByWorkDateDesc(Long taskId);

    // Find by project
    List<Timesheet> findByProjectIdOrderByWorkDateDesc(Long projectId);

    // Find by date range
    List<Timesheet> findByWorkDateBetweenOrderByWorkDateDesc(LocalDate startDate, LocalDate endDate);

    // Find by billing status
    List<Timesheet> findByBillingStatusOrderByWorkDateDesc(Timesheet.BillingStatus billingStatus);

    // Find by employee and date range
    List<Timesheet> findByEmployeeUsernameAndWorkDateBetweenOrderByWorkDateDesc(
        String employeeUsername, LocalDate startDate, LocalDate endDate
    );

    // Get total hours for employee
    @Query("SELECT SUM(t.hoursWorked) FROM Timesheet t WHERE t.employeeUsername = :username")
    Double getTotalHoursByEmployee(@Param("username") String username);

    // Get total cost for project
    @Query("SELECT SUM(t.totalCost) FROM Timesheet t WHERE t.projectId = :projectId")
    Double getTotalCostByProject(@Param("projectId") Long projectId);

    // Get total hours for project
    @Query("SELECT SUM(t.hoursWorked) FROM Timesheet t WHERE t.projectId = :projectId")
    Double getTotalHoursByProject(@Param("projectId") Long projectId);

    // Get billable hours for project
    @Query("SELECT SUM(t.hoursWorked) FROM Timesheet t WHERE t.projectId = :projectId AND t.billingStatus = 'BILLED'")
    Double getBillableHoursByProject(@Param("projectId") Long projectId);

    // Get billed vs non-billed totals
    @Query("SELECT t.billingStatus, SUM(t.totalCost) FROM Timesheet t GROUP BY t.billingStatus")
    List<Object[]> getBillingStatusTotals();
}

