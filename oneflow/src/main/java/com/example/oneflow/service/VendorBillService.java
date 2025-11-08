package com.example.oneflow.service;

import com.example.oneflow.model.VendorBill;
import com.example.oneflow.model.BillLine;
import com.example.oneflow.model.PurchaseOrder;
import com.example.oneflow.model.PurchaseOrderLine;
import com.example.oneflow.repository.VendorBillRepository;
import com.example.oneflow.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VendorBillService {

    @Autowired
    private VendorBillRepository vendorBillRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    public List<VendorBill> getAllBills() {
        return vendorBillRepository.findAll();
    }

    public Optional<VendorBill> getBillById(Long id) {
        return vendorBillRepository.findById(id);
    }

    public Optional<VendorBill> getBillByNumber(String billNumber) {
        return vendorBillRepository.findByBillNumber(billNumber);
    }

    public List<VendorBill> getBillsByProject(Long projectId) {
        return vendorBillRepository.findByProjectId(projectId);
    }

    public List<VendorBill> getBillsByVendor(Long vendorId) {
        return vendorBillRepository.findByVendorId(vendorId);
    }

    public List<VendorBill> getBillsByPurchaseOrder(Long purchaseOrderId) {
        return vendorBillRepository.findByPurchaseOrderId(purchaseOrderId);
    }

    public List<VendorBill> getBillsByPaymentStatus(String paymentStatus) {
        return vendorBillRepository.findByPaymentStatus(paymentStatus);
    }

    public List<VendorBill> getBillsByStatus(String status) {
        return vendorBillRepository.findByStatus(status);
    }

    @Transactional
    public VendorBill createBill(VendorBill bill) {
        // Set bidirectional relationship for line items
        if (bill.getItems() != null) {
            for (BillLine line : bill.getItems()) {
                line.setVendorBill(bill);
            }
        }
        bill.calculateTotal();
        bill.updatePaymentStatus();
        return vendorBillRepository.save(bill);
    }

    @Transactional
    public VendorBill createBillFromPurchaseOrder(Long purchaseOrderId, LocalDate billDate, Integer paymentTermDays) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(purchaseOrderId)
            .orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + purchaseOrderId));

        VendorBill bill = new VendorBill();
        bill.setPurchaseOrderId(purchaseOrderId);
        bill.setVendorId(purchaseOrder.getVendorId());
        bill.setVendorName(purchaseOrder.getVendorName());
        bill.setProjectId(purchaseOrder.getProjectId());
        bill.setBillDate(billDate);
        bill.setDueDate(billDate.plusDays(paymentTermDays != null ? paymentTermDays : 30));
        bill.setCurrency(purchaseOrder.getCurrency());
        bill.setStatus("Draft");
        bill.setPaymentStatus("Unpaid");

        // Copy line items from purchase order
        for (PurchaseOrderLine poLine : purchaseOrder.getItems()) {
            BillLine billLine = new BillLine();
            billLine.setVendorBill(bill);
            billLine.setProductId(poLine.getProductId());
            billLine.setProductName(poLine.getProductName());
            billLine.setDescription(poLine.getDescription());
            billLine.setQuantity(poLine.getQuantity());
            billLine.setUnitPrice(poLine.getUnitPrice());
            billLine.setPurchaseOrderLineId(poLine.getId());
            bill.getItems().add(billLine);
        }

        bill.calculateTotal();
        return vendorBillRepository.save(bill);
    }

    @Transactional
    public VendorBill updateBill(Long id, VendorBill billDetails) {
        return vendorBillRepository.findById(id).map(bill -> {
            if (billDetails.getVendorName() != null) 
                bill.setVendorName(billDetails.getVendorName());
            if (billDetails.getBillDate() != null) 
                bill.setBillDate(billDetails.getBillDate());
            if (billDetails.getDueDate() != null) 
                bill.setDueDate(billDetails.getDueDate());
            if (billDetails.getStatus() != null) 
                bill.setStatus(billDetails.getStatus());
            if (billDetails.getNotes() != null) 
                bill.setNotes(billDetails.getNotes());
            
            // Update line items if provided
            if (billDetails.getItems() != null) {
                bill.getItems().clear();
                for (BillLine line : billDetails.getItems()) {
                    line.setVendorBill(bill);
                    bill.getItems().add(line);
                }
            }
            
            bill.calculateTotal();
            bill.updatePaymentStatus();
            return vendorBillRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Vendor Bill not found with id " + id));
    }

    public void deleteBill(Long id) {
        vendorBillRepository.deleteById(id);
    }

    @Transactional
    public VendorBill postBill(Long id) {
        return vendorBillRepository.findById(id).map(bill -> {
            if ("Draft".equals(bill.getStatus())) {
                bill.setStatus("Posted");
                return vendorBillRepository.save(bill);
            }
            throw new RuntimeException("Only draft bills can be posted");
        }).orElseThrow(() -> new RuntimeException("Vendor Bill not found with id " + id));
    }

    @Transactional
    public VendorBill recordPayment(Long id, BigDecimal paymentAmount) {
        return vendorBillRepository.findById(id).map(bill -> {
            BigDecimal currentPaid = bill.getPaidAmount() != null ? bill.getPaidAmount() : BigDecimal.ZERO;
            bill.setPaidAmount(currentPaid.add(paymentAmount));
            bill.updatePaymentStatus();
            return vendorBillRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Vendor Bill not found with id " + id));
    }

    @Transactional
    public VendorBill cancelBill(Long id) {
        return vendorBillRepository.findById(id).map(bill -> {
            bill.setStatus("Cancelled");
            return vendorBillRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Vendor Bill not found with id " + id));
    }

    public BigDecimal getTotalBillAmountByProject(Long projectId) {
        BigDecimal total = vendorBillRepository.getTotalBillAmountByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPaidByProject(Long projectId) {
        BigDecimal total = vendorBillRepository.getTotalPaidAmountByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalOutstandingByProject(Long projectId) {
        BigDecimal total = vendorBillRepository.getTotalOutstandingByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public Long countByPaymentStatus(String paymentStatus) {
        return vendorBillRepository.countByPaymentStatus(paymentStatus);
    }
}
