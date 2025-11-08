package com.example.oneflow.repository;

import com.example.oneflow.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    
    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);
    
    List<PurchaseOrder> findByProjectId(Long projectId);
    
    List<PurchaseOrder> findByVendorId(Long vendorId);
    
    List<PurchaseOrder> findByStatus(String status);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.projectId = :projectId AND po.status = :status")
    List<PurchaseOrder> findByProjectIdAndStatus(
        @Param("projectId") Long projectId,
        @Param("status") String status
    );
    
    @Query("SELECT SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.projectId = :projectId AND po.status IN ('Confirmed', 'Received')")
    BigDecimal getTotalCostByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = :status")
    Long countByStatus(@Param("status") String status);
}
