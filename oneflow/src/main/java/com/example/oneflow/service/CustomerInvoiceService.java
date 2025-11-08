package com.example.oneflow.service;

import com.example.oneflow.model.CustomerInvoice;
import com.example.oneflow.model.InvoiceLine;
import com.example.oneflow.model.SalesOrder;
import com.example.oneflow.model.SalesOrderLine;
import com.example.oneflow.repository.CustomerInvoiceRepository;
import com.example.oneflow.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerInvoiceService {

    @Autowired
    private CustomerInvoiceRepository customerInvoiceRepository;

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    public List<CustomerInvoice> getAllInvoices() {
        return customerInvoiceRepository.findAll();
    }

    public Optional<CustomerInvoice> getInvoiceById(Long id) {
        return customerInvoiceRepository.findById(id);
    }

    public Optional<CustomerInvoice> getInvoiceByNumber(String invoiceNumber) {
        return customerInvoiceRepository.findByInvoiceNumber(invoiceNumber);
    }

    public List<CustomerInvoice> getInvoicesByProject(Long projectId) {
        return customerInvoiceRepository.findByProjectId(projectId);
    }

    public List<CustomerInvoice> getInvoicesByCustomer(Long customerId) {
        return customerInvoiceRepository.findByCustomerId(customerId);
    }

    public List<CustomerInvoice> getInvoicesBySalesOrder(Long salesOrderId) {
        return customerInvoiceRepository.findBySalesOrderId(salesOrderId);
    }

    public List<CustomerInvoice> getInvoicesByPaymentStatus(String paymentStatus) {
        return customerInvoiceRepository.findByPaymentStatus(paymentStatus);
    }

    public List<CustomerInvoice> getInvoicesByStatus(String status) {
        return customerInvoiceRepository.findByStatus(status);
    }

    @Transactional
    public CustomerInvoice createInvoice(CustomerInvoice invoice) {
        // Set bidirectional relationship for line items
        if (invoice.getItems() != null) {
            for (InvoiceLine line : invoice.getItems()) {
                line.setCustomerInvoice(invoice);
            }
        }
        invoice.calculateTotal();
        invoice.updatePaymentStatus();
        return customerInvoiceRepository.save(invoice);
    }

    @Transactional
    public CustomerInvoice createInvoiceFromSalesOrder(Long salesOrderId, LocalDate invoiceDate, Integer paymentTermDays) {
        SalesOrder salesOrder = salesOrderRepository.findById(salesOrderId)
            .orElseThrow(() -> new RuntimeException("Sales Order not found with id " + salesOrderId));

        CustomerInvoice invoice = new CustomerInvoice();
        invoice.setSalesOrderId(salesOrderId);
        invoice.setCustomerId(salesOrder.getCustomerId());
        invoice.setCustomerName(salesOrder.getCustomerName());
        invoice.setProjectId(salesOrder.getProjectId());
        invoice.setInvoiceDate(invoiceDate);
        invoice.setDueDate(invoiceDate.plusDays(paymentTermDays != null ? paymentTermDays : 30));
        invoice.setCurrency(salesOrder.getCurrency());
        invoice.setStatus("Draft");
        invoice.setPaymentStatus("Unpaid");

        // Copy line items from sales order
        for (SalesOrderLine soLine : salesOrder.getItems()) {
            InvoiceLine invoiceLine = new InvoiceLine();
            invoiceLine.setCustomerInvoice(invoice);
            invoiceLine.setProductId(soLine.getProductId());
            invoiceLine.setProductName(soLine.getProductName());
            invoiceLine.setDescription(soLine.getDescription());
            invoiceLine.setQuantity(soLine.getQuantity());
            invoiceLine.setUnitPrice(soLine.getUnitPrice());
            invoiceLine.setSalesOrderLineId(soLine.getId());
            invoice.getItems().add(invoiceLine);
        }

        invoice.calculateTotal();
        return customerInvoiceRepository.save(invoice);
    }

    @Transactional
    public CustomerInvoice updateInvoice(Long id, CustomerInvoice invoiceDetails) {
        return customerInvoiceRepository.findById(id).map(invoice -> {
            if (invoiceDetails.getCustomerName() != null) 
                invoice.setCustomerName(invoiceDetails.getCustomerName());
            if (invoiceDetails.getInvoiceDate() != null) 
                invoice.setInvoiceDate(invoiceDetails.getInvoiceDate());
            if (invoiceDetails.getDueDate() != null) 
                invoice.setDueDate(invoiceDetails.getDueDate());
            if (invoiceDetails.getStatus() != null) 
                invoice.setStatus(invoiceDetails.getStatus());
            if (invoiceDetails.getNotes() != null) 
                invoice.setNotes(invoiceDetails.getNotes());
            if (invoiceDetails.getPaymentTerms() != null) 
                invoice.setPaymentTerms(invoiceDetails.getPaymentTerms());
            
            // Update line items if provided
            if (invoiceDetails.getItems() != null) {
                invoice.getItems().clear();
                for (InvoiceLine line : invoiceDetails.getItems()) {
                    line.setCustomerInvoice(invoice);
                    invoice.getItems().add(line);
                }
            }
            
            invoice.calculateTotal();
            invoice.updatePaymentStatus();
            return customerInvoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("Invoice not found with id " + id));
    }

    public void deleteInvoice(Long id) {
        customerInvoiceRepository.deleteById(id);
    }

    @Transactional
    public CustomerInvoice sendInvoice(Long id) {
        return customerInvoiceRepository.findById(id).map(invoice -> {
            if ("Draft".equals(invoice.getStatus())) {
                invoice.setStatus("Sent");
                return customerInvoiceRepository.save(invoice);
            }
            throw new RuntimeException("Only draft invoices can be sent");
        }).orElseThrow(() -> new RuntimeException("Invoice not found with id " + id));
    }

    @Transactional
    public CustomerInvoice recordPayment(Long id, BigDecimal paymentAmount) {
        return customerInvoiceRepository.findById(id).map(invoice -> {
            BigDecimal currentPaid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
            invoice.setPaidAmount(currentPaid.add(paymentAmount));
            invoice.updatePaymentStatus();
            return customerInvoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("Invoice not found with id " + id));
    }

    @Transactional
    public CustomerInvoice cancelInvoice(Long id) {
        return customerInvoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus("Cancelled");
            return customerInvoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("Invoice not found with id " + id));
    }

    public BigDecimal getTotalInvoicedByProject(Long projectId) {
        BigDecimal total = customerInvoiceRepository.getTotalInvoicedAmountByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPaidByProject(Long projectId) {
        BigDecimal total = customerInvoiceRepository.getTotalPaidAmountByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalOutstandingByProject(Long projectId) {
        BigDecimal total = customerInvoiceRepository.getTotalOutstandingByProject(projectId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public Long countByPaymentStatus(String paymentStatus) {
        return customerInvoiceRepository.countByPaymentStatus(paymentStatus);
    }
}
