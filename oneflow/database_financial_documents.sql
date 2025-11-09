-- Financial Documents Table Creation Script
-- Run this in MySQL to create the financial_documents table

USE oneflow;

-- Drop table if exists (for clean setup)
-- DROP TABLE IF EXISTS financial_documents;

-- Create financial_documents table
CREATE TABLE IF NOT EXISTS financial_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) UNIQUE,
    project_id BIGINT,
    project_name VARCHAR(255),
    customer_name VARCHAR(255),
    vendor_name VARCHAR(255),
    employee_username VARCHAR(255),
    amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    document_date DATE NOT NULL,
    due_date DATE,
    description TEXT,
    milestone_name VARCHAR(255),
    is_billable BOOLEAN DEFAULT FALSE,
    receipt_url VARCHAR(500),
    approved_by VARCHAR(255),
    approved_at DATETIME,
    created_by VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_doc_type (document_type),
    INDEX idx_project_id (project_id),
    INDEX idx_status (status),
    INDEX idx_doc_date (document_date)
);

-- Insert demo data for testing (Scenario 1: Fixed-Price Project)
INSERT INTO financial_documents
(document_type, document_number, project_id, project_name, customer_name, amount, status, document_date, description, created_by)
VALUES
('SALES_ORDER', 'SO-001', 1, 'Brand Website', 'ABC Corp', 100000, 'APPROVED', '2025-11-01', 'Brand Website project for ABC Corp', 'super');

-- Customer Invoices (Milestone-based)
INSERT INTO financial_documents
(document_type, document_number, project_id, project_name, customer_name, amount, paid_amount, status, document_date, due_date, milestone_name, description, created_by)
VALUES
('CUSTOMER_INVOICE', 'INV-001', 1, 'Brand Website', 'ABC Corp', 40000, 40000, 'PAID', '2025-11-15', '2025-12-15', 'Design Phase', 'Invoice for Design milestone completion', 'super'),
('CUSTOMER_INVOICE', 'INV-002', 1, 'Brand Website', 'ABC Corp', 60000, 30000, 'PARTIALLY_PAID', '2025-12-01', '2025-12-31', 'Build Phase', 'Invoice for Build milestone completion', 'super');

-- Purchase Order & Vendor Bill (Scenario 2: Vendor Needed)
INSERT INTO financial_documents
(document_type, document_number, project_id, project_name, vendor_name, amount, status, document_date, description, created_by)
VALUES
('PURCHASE_ORDER', 'PO-001', 1, 'Brand Website', 'Professional Photography Studio', 12000, 'APPROVED', '2025-11-10', 'Product photography for website', 'super');

INSERT INTO financial_documents
(document_type, document_number, project_id, project_name, vendor_name, amount, paid_amount, status, document_date, due_date, description, created_by)
VALUES
('VENDOR_BILL', 'BILL-001', 1, 'Brand Website', 'Professional Photography Studio', 12000, 12000, 'PAID', '2025-11-20', '2025-12-20', 'Photography work completed and paid', 'super');

-- Expense (Scenario 3: Team Expense)
INSERT INTO financial_documents
(document_type, document_number, project_id, project_name, employee_username, amount, status, document_date, is_billable, description, approved_by, approved_at, created_by)
VALUES
('EXPENSE', 'EXP-001', 1, 'Brand Website', 'jane_dev', 1500, 'APPROVED', '2025-11-18', TRUE, 'Client site visit - travel expenses', 'john_manager', NOW(), 'jane_dev');

-- Verify data
SELECT
    document_type,
    document_number,
    project_name,
    COALESCE(customer_name, vendor_name, employee_username) as party,
    amount,
    paid_amount,
    status,
    document_date
FROM financial_documents
ORDER BY document_date;

-- Check project financials
SELECT
    project_id,
    project_name,
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) as revenue,
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as costs,
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) -
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as profit
FROM financial_documents
WHERE project_id = 1
GROUP BY project_id, project_name;

