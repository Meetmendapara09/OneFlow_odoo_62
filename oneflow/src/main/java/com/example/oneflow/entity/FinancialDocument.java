package com.example.oneflow.entity;

import jakarta.persistence.*;

@Entity
public class FinancialDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Sales Order, Purchase Order, Customer Invoice, Vendor Bill, Expense
    private Double amount;

    @ManyToOne
    private Project project;

    private String state; // Draft, Approved, Paid

    // Getters and Setters
}
