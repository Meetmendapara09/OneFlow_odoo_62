package com.example.oneflow.controller;

import com.example.oneflow.model.VendorBill;
import com.example.oneflow.service.VendorBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendor-bills")
@CrossOrigin(origins = "*")
public class VendorBillController {

    @Autowired
    private VendorBillService vendorBillService;

    @GetMapping
    public ResponseEntity<List<VendorBill>> getAllBills() {
        return ResponseEntity.ok(vendorBillService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorBill> getBillById(@PathVariable Long id) {
        Optional<VendorBill> bill = vendorBillService.getBillById(id);
        return bill.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{billNumber}")
    public ResponseEntity<VendorBill> getBillByNumber(@PathVariable String billNumber) {
        Optional<VendorBill> bill = vendorBillService.getBillByNumber(billNumber);
        return bill.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<VendorBill>> getBillsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(vendorBillService.getBillsByProject(projectId));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorBill>> getBillsByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorBillService.getBillsByVendor(vendorId));
    }

    @GetMapping("/purchase-order/{purchaseOrderId}")
    public ResponseEntity<List<VendorBill>> getBillsByPurchaseOrder(@PathVariable Long purchaseOrderId) {
        return ResponseEntity.ok(vendorBillService.getBillsByPurchaseOrder(purchaseOrderId));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<VendorBill>> getBillsByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(vendorBillService.getBillsByPaymentStatus(paymentStatus));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<VendorBill>> getBillsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(vendorBillService.getBillsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<VendorBill> createBill(@RequestBody VendorBill bill) {
        VendorBill created = vendorBillService.createBill(bill);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/from-purchase-order/{purchaseOrderId}")
    public ResponseEntity<VendorBill> createBillFromPurchaseOrder(
            @PathVariable Long purchaseOrderId,
            @RequestBody Map<String, Object> request) {
        try {
            LocalDate billDate = request.containsKey("billDate") 
                ? LocalDate.parse((String) request.get("billDate"))
                : LocalDate.now();
            
            Integer paymentTermDays = request.containsKey("paymentTermDays")
                ? (Integer) request.get("paymentTermDays")
                : 30;
            
            VendorBill bill = vendorBillService.createBillFromPurchaseOrder(
                purchaseOrderId, billDate, paymentTermDays);
            return ResponseEntity.status(HttpStatus.CREATED).body(bill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorBill> updateBill(
            @PathVariable Long id,
            @RequestBody VendorBill billDetails) {
        try {
            VendorBill updated = vendorBillService.updateBill(id, billDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        vendorBillService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/post")
    public ResponseEntity<VendorBill> postBill(@PathVariable Long id) {
        try {
            VendorBill posted = vendorBillService.postBill(id);
            return ResponseEntity.ok(posted);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/record-payment")
    public ResponseEntity<VendorBill> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        try {
            BigDecimal paymentAmount = request.get("amount");
            VendorBill updated = vendorBillService.recordPayment(id, paymentAmount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<VendorBill> cancelBill(@PathVariable Long id) {
        try {
            VendorBill cancelled = vendorBillService.cancelBill(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/total-bills")
    public ResponseEntity<BigDecimal> getTotalBillAmountByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(vendorBillService.getTotalBillAmountByProject(projectId));
    }

    @GetMapping("/project/{projectId}/total-paid")
    public ResponseEntity<BigDecimal> getTotalPaidByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(vendorBillService.getTotalPaidByProject(projectId));
    }

    @GetMapping("/project/{projectId}/total-outstanding")
    public ResponseEntity<BigDecimal> getTotalOutstandingByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(vendorBillService.getTotalOutstandingByProject(projectId));
    }

    @GetMapping("/stats/count-by-payment-status/{paymentStatus}")
    public ResponseEntity<Long> countByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(vendorBillService.countByPaymentStatus(paymentStatus));
    }
}
