package com.example.oneflow.controller;

import com.example.oneflow.model.PurchaseOrder;
import com.example.oneflow.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(@PathVariable Long id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
        return purchaseOrder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderByNumber(@PathVariable String orderNumber) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderService.getPurchaseOrderByNumber(orderNumber);
        return purchaseOrder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByProject(projectId));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByVendor(vendorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByStatus(status));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        PurchaseOrder created = purchaseOrderService.createPurchaseOrder(purchaseOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrder purchaseOrderDetails) {
        try {
            PurchaseOrder updated = purchaseOrderService.updatePurchaseOrder(id, purchaseOrderDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<PurchaseOrder> confirmPurchaseOrder(@PathVariable Long id) {
        try {
            PurchaseOrder confirmed = purchaseOrderService.confirmPurchaseOrder(id);
            return ResponseEntity.ok(confirmed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> markAsReceived(@PathVariable Long id) {
        try {
            PurchaseOrder received = purchaseOrderService.markAsReceived(id);
            return ResponseEntity.ok(received);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<PurchaseOrder> cancelPurchaseOrder(@PathVariable Long id) {
        try {
            PurchaseOrder cancelled = purchaseOrderService.cancelPurchaseOrder(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/link-project")
    public ResponseEntity<PurchaseOrder> linkToProject(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long projectId = request.get("projectId");
            PurchaseOrder linked = purchaseOrderService.linkToProject(id, projectId);
            return ResponseEntity.ok(linked);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}/total-cost")
    public ResponseEntity<BigDecimal> getTotalCostByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(purchaseOrderService.getTotalCostByProject(projectId));
    }

    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> countByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseOrderService.countByStatus(status));
    }
}
