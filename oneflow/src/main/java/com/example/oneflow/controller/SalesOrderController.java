package com.example.oneflow.controller;

import com.example.oneflow.model.SalesOrder;
import com.example.oneflow.service.SalesOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "*")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    @GetMapping
    public ResponseEntity<List<SalesOrder>> getAllSalesOrders() {
        return ResponseEntity.ok(salesOrderService.getAllSalesOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getSalesOrderById(@PathVariable Long id) {
        Optional<SalesOrder> salesOrder = salesOrderService.getSalesOrderById(id);
        return salesOrder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<SalesOrder> getSalesOrderByNumber(@PathVariable String orderNumber) {
        Optional<SalesOrder> salesOrder = salesOrderService.getSalesOrderByNumber(orderNumber);
        return salesOrder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SalesOrder>> getSalesOrdersByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(salesOrderService.getSalesOrdersByProject(projectId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SalesOrder>> getSalesOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(salesOrderService.getSalesOrdersByCustomer(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SalesOrder>> getSalesOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(salesOrderService.getSalesOrdersByStatus(status));
    }

    @PostMapping
    public ResponseEntity<SalesOrder> createSalesOrder(@RequestBody SalesOrder salesOrder) {
        SalesOrder created = salesOrderService.createSalesOrder(salesOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrder> updateSalesOrder(
            @PathVariable Long id,
            @RequestBody SalesOrder salesOrderDetails) {
        try {
            SalesOrder updated = salesOrderService.updateSalesOrder(id, salesOrderDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalesOrder(@PathVariable Long id) {
        salesOrderService.deleteSalesOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<SalesOrder> confirmSalesOrder(@PathVariable Long id) {
        try {
            SalesOrder confirmed = salesOrderService.confirmSalesOrder(id);
            return ResponseEntity.ok(confirmed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<SalesOrder> cancelSalesOrder(@PathVariable Long id) {
        try {
            SalesOrder cancelled = salesOrderService.cancelSalesOrder(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/link-project")
    public ResponseEntity<SalesOrder> linkToProject(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long projectId = request.get("projectId");
            SalesOrder linked = salesOrderService.linkToProject(id, projectId);
            return ResponseEntity.ok(linked);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}/total-revenue")
    public ResponseEntity<BigDecimal> getTotalRevenueByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(salesOrderService.getTotalRevenueByProject(projectId));
    }

    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> countByStatus(@PathVariable String status) {
        return ResponseEntity.ok(salesOrderService.countByStatus(status));
    }
}
