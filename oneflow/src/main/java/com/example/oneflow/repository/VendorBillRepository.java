package com.example.oneflow.repository;

import com.example.oneflow.model.VendorBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorBillRepository extends JpaRepository<VendorBill, Long> {
    
    Optional<VendorBill> findByBillNumber(String billNumber);
    
    List<VendorBill> findByProjectId(Long projectId);
    
    List<VendorBill> findByVendorId(Long vendorId);
    
    List<VendorBill> findByPurchaseOrderId(Long purchaseOrderId);
    
    List<VendorBill> findByPaymentStatus(String paymentStatus);
    
    List<VendorBill> findByStatus(String status);
    
    @Query("SELECT vb FROM VendorBill vb WHERE vb.projectId = :projectId AND vb.paymentStatus = :paymentStatus")
    List<VendorBill> findByProjectIdAndPaymentStatus(
        @Param("projectId") Long projectId,
        @Param("paymentStatus") String paymentStatus
    );
    
    @Query("SELECT SUM(vb.totalAmount) FROM VendorBill vb WHERE vb.projectId = :projectId AND vb.status IN ('Posted', 'Paid')")
    BigDecimal getTotalBillAmountByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(vb.paidAmount) FROM VendorBill vb WHERE vb.projectId = :projectId")
    BigDecimal getTotalPaidAmountByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(vb.totalAmount - COALESCE(vb.paidAmount, 0)) FROM VendorBill vb WHERE vb.projectId = :projectId AND vb.paymentStatus != 'Paid'")
    BigDecimal getTotalOutstandingByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(vb) FROM VendorBill vb WHERE vb.paymentStatus = :paymentStatus")
    Long countByPaymentStatus(@Param("paymentStatus") String paymentStatus);
}
