package com.example.oneflow.service;

import com.example.oneflow.model.SalesOrder;
import com.example.oneflow.model.SalesOrderLine;
import com.example.oneflow.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SalesOrderService {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public Optional<SalesOrder> getSalesOrderById(Long id) {
        return salesOrderRepository.findById(id);
    }

    public Optional<SalesOrder> getSalesOrderByNumber(String orderNumber) {
        return salesOrderRepository.findByOrderNumber(orderNumber);
    }

    public List<SalesOrder> getSalesOrdersByProject(Long projectId) {
        return salesOrderRepository.findByProjectId(projectId);
    }

    public List<SalesOrder> getSalesOrdersByCustomer(Long customerId) {
        return salesOrderRepository.findByCustomerId(customerId);
    }

    public List<SalesOrder> getSalesOrdersByStatus(String status) {
        return salesOrderRepository.findByStatus(status);
    }

    @Transactional
    public SalesOrder createSalesOrder(SalesOrder salesOrder) {
        // Set bidirectional relationship for line items
        if (salesOrder.getItems() != null) {
            for (SalesOrderLine line : salesOrder.getItems()) {
                line.setSalesOrder(salesOrder);
            }
        }
        salesOrder.calculateTotal();
        return salesOrderRepository.save(salesOrder);
    }

    @Transactional
    public SalesOrder updateSalesOrder(Long id, SalesOrder salesOrderDetails) {
        return salesOrderRepository.findById(id).map(salesOrder -> {
            if (salesOrderDetails.getCustomerName() != null) 
                salesOrder.setCustomerName(salesOrderDetails.getCustomerName());
            if (salesOrderDetails.getOrderDate() != null) 
                salesOrder.setOrderDate(salesOrderDetails.getOrderDate());
            if (salesOrderDetails.getDeliveryDate() != null) 
                salesOrder.setDeliveryDate(salesOrderDetails.getDeliveryDate());
            if (salesOrderDetails.getStatus() != null) 
                salesOrder.setStatus(salesOrderDetails.getStatus());
            if (salesOrderDetails.getNotes() != null) 
                salesOrder.setNotes(salesOrderDetails.getNotes());
            if (salesOrderDetails.getProjectId() != null) 
                salesOrder.setProjectId(salesOrderDetails.getProjectId());
            
            // Update line items if provided
            if (salesOrderDetails.getItems() != null) {
                salesOrder.getItems().clear();
                for (SalesOrderLine line : salesOrderDetails.getItems()) {
                    line.setSalesOrder(salesOrder);
                    salesOrder.getItems().add(line);
                }
            }
            
            salesOrder.calculateTotal();
            return salesOrderRepository.save(salesOrder);
        }).orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    public void deleteSalesOrder(Long id) {
        salesOrderRepository.deleteById(id);
    }

    @Transactional
    public SalesOrder confirmSalesOrder(Long id) {
        return salesOrderRepository.findById(id).map(salesOrder -> {
            if ("Draft".equals(salesOrder.getStatus())) {
                salesOrder.setStatus("Confirmed");
                return salesOrderRepository.save(salesOrder);
            }
            throw new RuntimeException("Only draft orders can be confirmed");
        }).orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    @Transactional
    public SalesOrder cancelSalesOrder(Long id) {
        return salesOrderRepository.findById(id).map(salesOrder -> {
            salesOrder.setStatus("Cancelled");
            return salesOrderRepository.save(salesOrder);
        }).orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    @Transactional
    public SalesOrder linkToProject(Long id, Long projectId) {
        return salesOrderRepository.findById(id).map(salesOrder -> {
            salesOrder.setProjectId(projectId);
            return salesOrderRepository.save(salesOrder);
        }).orElseThrow(() -> new RuntimeException("Sales Order not found with id " + id));
    }

    public BigDecimal getTotalRevenueByProject(Long projectId) {
        BigDecimal revenue = salesOrderRepository.getTotalRevenueByProject(projectId);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    public Long countByStatus(String status) {
        return salesOrderRepository.countByStatus(status);
    }
}
