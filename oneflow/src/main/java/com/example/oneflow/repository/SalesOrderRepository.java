package com.example.oneflow.repository;

import com.example.oneflow.model.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    
    Optional<SalesOrder> findByOrderNumber(String orderNumber);
    
    List<SalesOrder> findByProjectId(Long projectId);
    
    List<SalesOrder> findByCustomerId(Long customerId);
    
    List<SalesOrder> findByStatus(String status);
    
    @Query("SELECT so FROM SalesOrder so WHERE so.projectId = :projectId AND so.status = :status")
    List<SalesOrder> findByProjectIdAndStatus(
        @Param("projectId") Long projectId,
        @Param("status") String status
    );
    
    @Query("SELECT SUM(so.totalAmount) FROM SalesOrder so WHERE so.projectId = :projectId AND so.status IN ('Confirmed', 'In Progress', 'Done')")
    BigDecimal getTotalRevenueByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(so) FROM SalesOrder so WHERE so.status = :status")
    Long countByStatus(@Param("status") String status);
}
