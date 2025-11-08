package com.example.oneflow.controller;

import com.example.oneflow.model.CustomerInvoice;
import com.example.oneflow.service.CustomerInvoiceService;
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
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class CustomerInvoiceController {

    @Autowired
    private CustomerInvoiceService customerInvoiceService;

    @GetMapping
    public ResponseEntity<List<CustomerInvoice>> getAllInvoices() {
        return ResponseEntity.ok(customerInvoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerInvoice> getInvoiceById(@PathVariable Long id) {
        Optional<CustomerInvoice> invoice = customerInvoiceService.getInvoiceById(id);
        return invoice.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<CustomerInvoice> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        Optional<CustomerInvoice> invoice = customerInvoiceService.getInvoiceByNumber(invoiceNumber);
        return invoice.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CustomerInvoice>> getInvoicesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(customerInvoiceService.getInvoicesByProject(projectId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerInvoice>> getInvoicesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerInvoiceService.getInvoicesByCustomer(customerId));
    }

    @GetMapping("/sales-order/{salesOrderId}")
    public ResponseEntity<List<CustomerInvoice>> getInvoicesBySalesOrder(@PathVariable Long salesOrderId) {
        return ResponseEntity.ok(customerInvoiceService.getInvoicesBySalesOrder(salesOrderId));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<CustomerInvoice>> getInvoicesByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(customerInvoiceService.getInvoicesByPaymentStatus(paymentStatus));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CustomerInvoice>> getInvoicesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(customerInvoiceService.getInvoicesByStatus(status));
    }

    @PostMapping
    public ResponseEntity<CustomerInvoice> createInvoice(@RequestBody CustomerInvoice invoice) {
        CustomerInvoice created = customerInvoiceService.createInvoice(invoice);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/from-sales-order/{salesOrderId}")
    public ResponseEntity<CustomerInvoice> createInvoiceFromSalesOrder(
            @PathVariable Long salesOrderId,
            @RequestBody Map<String, Object> request) {
        try {
            LocalDate invoiceDate = request.containsKey("invoiceDate") 
                ? LocalDate.parse((String) request.get("invoiceDate"))
                : LocalDate.now();
            
            Integer paymentTermDays = request.containsKey("paymentTermDays")
                ? (Integer) request.get("paymentTermDays")
                : 30;
            
            CustomerInvoice invoice = customerInvoiceService.createInvoiceFromSalesOrder(
                salesOrderId, invoiceDate, paymentTermDays);
            return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerInvoice> updateInvoice(
            @PathVariable Long id,
            @RequestBody CustomerInvoice invoiceDetails) {
        try {
            CustomerInvoice updated = customerInvoiceService.updateInvoice(id, invoiceDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        customerInvoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<CustomerInvoice> sendInvoice(@PathVariable Long id) {
        try {
            CustomerInvoice sent = customerInvoiceService.sendInvoice(id);
            return ResponseEntity.ok(sent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/record-payment")
    public ResponseEntity<CustomerInvoice> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        try {
            BigDecimal paymentAmount = request.get("amount");
            CustomerInvoice updated = customerInvoiceService.recordPayment(id, paymentAmount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<CustomerInvoice> cancelInvoice(@PathVariable Long id) {
        try {
            CustomerInvoice cancelled = customerInvoiceService.cancelInvoice(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/total-invoiced")
    public ResponseEntity<BigDecimal> getTotalInvoicedByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(customerInvoiceService.getTotalInvoicedByProject(projectId));
    }

    @GetMapping("/project/{projectId}/total-paid")
    public ResponseEntity<BigDecimal> getTotalPaidByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(customerInvoiceService.getTotalPaidByProject(projectId));
    }

    @GetMapping("/project/{projectId}/total-outstanding")
    public ResponseEntity<BigDecimal> getTotalOutstandingByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(customerInvoiceService.getTotalOutstandingByProject(projectId));
    }

    @GetMapping("/stats/count-by-payment-status/{paymentStatus}")
    public ResponseEntity<Long> countByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(customerInvoiceService.countByPaymentStatus(paymentStatus));
    }
}
