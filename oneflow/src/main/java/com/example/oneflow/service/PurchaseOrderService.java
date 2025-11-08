package com.example.oneflow.service;

import com.example.oneflow.model.PurchaseOrder;
import com.example.oneflow.model.PurchaseOrderLine;
import com.example.oneflow.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public Optional<PurchaseOrder> getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    public Optional<PurchaseOrder> getPurchaseOrderByNumber(String orderNumber) {
        return purchaseOrderRepository.findByOrderNumber(orderNumber);
    }

    public List<PurchaseOrder> getPurchaseOrdersByProject(Long projectId) {
        return purchaseOrderRepository.findByProjectId(projectId);
    }

    public List<PurchaseOrder> getPurchaseOrdersByVendor(Long vendorId) {
        return purchaseOrderRepository.findByVendorId(vendorId);
    }

    public List<PurchaseOrder> getPurchaseOrdersByStatus(String status) {
        return purchaseOrderRepository.findByStatus(status);
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {
        // Set bidirectional relationship for line items
        if (purchaseOrder.getItems() != null) {
            for (PurchaseOrderLine line : purchaseOrder.getItems()) {
                line.setPurchaseOrder(purchaseOrder);
            }
        }
        purchaseOrder.calculateTotal();
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Transactional
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrderDetails) {
        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            if (purchaseOrderDetails.getVendorName() != null) 
                purchaseOrder.setVendorName(purchaseOrderDetails.getVendorName());
            if (purchaseOrderDetails.getOrderDate() != null) 
                purchaseOrder.setOrderDate(purchaseOrderDetails.getOrderDate());
            if (purchaseOrderDetails.getExpectedDeliveryDate() != null) 
                purchaseOrder.setExpectedDeliveryDate(purchaseOrderDetails.getExpectedDeliveryDate());
            if (purchaseOrderDetails.getStatus() != null) 
                purchaseOrder.setStatus(purchaseOrderDetails.getStatus());
            if (purchaseOrderDetails.getNotes() != null) 
                purchaseOrder.setNotes(purchaseOrderDetails.getNotes());
            if (purchaseOrderDetails.getDeliveryAddress() != null) 
                purchaseOrder.setDeliveryAddress(purchaseOrderDetails.getDeliveryAddress());
            if (purchaseOrderDetails.getProjectId() != null) 
                purchaseOrder.setProjectId(purchaseOrderDetails.getProjectId());
            
            // Update line items if provided
            if (purchaseOrderDetails.getItems() != null) {
                purchaseOrder.getItems().clear();
                for (PurchaseOrderLine line : purchaseOrderDetails.getItems()) {
                    line.setPurchaseOrder(purchaseOrder);
                    purchaseOrder.getItems().add(line);
                }
            }
            
            purchaseOrder.calculateTotal();
            return purchaseOrderRepository.save(purchaseOrder);
        }).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    public void deletePurchaseOrder(Long id) {
        purchaseOrderRepository.deleteById(id);
    }

    @Transactional
    public PurchaseOrder confirmPurchaseOrder(Long id) {
        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            if ("Draft".equals(purchaseOrder.getStatus())) {
                purchaseOrder.setStatus("Confirmed");
                return purchaseOrderRepository.save(purchaseOrder);
            }
            throw new RuntimeException("Only draft orders can be confirmed");
        }).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    @Transactional
    public PurchaseOrder markAsReceived(Long id) {
        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            if ("Confirmed".equals(purchaseOrder.getStatus())) {
                purchaseOrder.setStatus("Received");
                // Mark all items as fully received
                for (PurchaseOrderLine line : purchaseOrder.getItems()) {
                    line.setReceivedQuantity(line.getQuantity());
                }
                return purchaseOrderRepository.save(purchaseOrder);
            }
            throw new RuntimeException("Only confirmed orders can be marked as received");
        }).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    @Transactional
    public PurchaseOrder cancelPurchaseOrder(Long id) {
        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            purchaseOrder.setStatus("Cancelled");
            return purchaseOrderRepository.save(purchaseOrder);
        }).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    @Transactional
    public PurchaseOrder linkToProject(Long id, Long projectId) {
        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            purchaseOrder.setProjectId(projectId);
            return purchaseOrderRepository.save(purchaseOrder);
        }).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    public BigDecimal getTotalCostByProject(Long projectId) {
        BigDecimal cost = purchaseOrderRepository.getTotalCostByProject(projectId);
        return cost != null ? cost : BigDecimal.ZERO;
    }

    public Long countByStatus(String status) {
        return purchaseOrderRepository.countByStatus(status);
    }
}
