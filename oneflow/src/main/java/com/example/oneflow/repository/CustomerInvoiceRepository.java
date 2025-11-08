package com.example.oneflow.repository;

import com.example.oneflow.model.CustomerInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerInvoiceRepository extends JpaRepository<CustomerInvoice, Long> {
    
    Optional<CustomerInvoice> findByInvoiceNumber(String invoiceNumber);
    
    List<CustomerInvoice> findByProjectId(Long projectId);
    
    List<CustomerInvoice> findByCustomerId(Long customerId);
    
    List<CustomerInvoice> findBySalesOrderId(Long salesOrderId);
    
    List<CustomerInvoice> findByPaymentStatus(String paymentStatus);
    
    List<CustomerInvoice> findByStatus(String status);
    
    @Query("SELECT ci FROM CustomerInvoice ci WHERE ci.projectId = :projectId AND ci.paymentStatus = :paymentStatus")
    List<CustomerInvoice> findByProjectIdAndPaymentStatus(
        @Param("projectId") Long projectId,
        @Param("paymentStatus") String paymentStatus
    );
    
    @Query("SELECT SUM(ci.totalAmount) FROM CustomerInvoice ci WHERE ci.projectId = :projectId AND ci.status IN ('Sent', 'Paid')")
    BigDecimal getTotalInvoicedAmountByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(ci.paidAmount) FROM CustomerInvoice ci WHERE ci.projectId = :projectId")
    BigDecimal getTotalPaidAmountByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(ci.totalAmount - COALESCE(ci.paidAmount, 0)) FROM CustomerInvoice ci WHERE ci.projectId = :projectId AND ci.paymentStatus != 'Paid'")
    BigDecimal getTotalOutstandingByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(ci) FROM CustomerInvoice ci WHERE ci.paymentStatus = :paymentStatus")
    Long countByPaymentStatus(@Param("paymentStatus") String paymentStatus);
}
