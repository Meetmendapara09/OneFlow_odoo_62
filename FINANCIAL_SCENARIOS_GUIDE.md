    'Professional Photography Studio',
    12000.00,
    'APPROVED',
    CURDATE(),
    'Professional photography services for website images'
);
```

### Step 2: Vendor Completes Work - Record Vendor Bill

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    vendor_name, amount, status, document_date, due_date, description
) VALUES (
    'VENDOR_BILL',
    'BILL-001',
    1,
    'Brand Website',
    'Professional Photography Studio',
    12000.00,
    'APPROVED',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 15 DAY),
    'Bill for photography services rendered'
);
```

### Step 3: View Updated Project Financials

```sql
SELECT 
    'Revenue' as Type,
    SUM(amount) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')

UNION ALL

SELECT 
    'Costs' as Type,
    SUM(amount) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')

UNION ALL

SELECT 
    'Profit' as Type,
    (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')
    ) - (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')
    ) as Total;
```

**Expected Result:**
```
Type    | Total
--------+----------
Revenue | 100,000
Costs   | 12,000
Profit  | 88,000
```

---

## 🎯 SCENARIO 3: Team Expense During Project

**Story**: Developer travels to client site, expense ₹1,500

### Step 1: Employee Submits Expense

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    employee_username, amount, is_billable, status, document_date,
    description, receipt_url
) VALUES (
    'EXPENSE',
    'EXP-001',
    1,
    'Brand Website',
    'jane_dev',
    1500.00,
    TRUE,  -- Billable expense
    'PENDING',  -- Awaiting approval
    CURDATE(),
    'Travel to client site for requirement gathering',
    'https://example.com/receipts/exp001.pdf'
);
```

### Step 2: Project Manager Approves Expense

```sql
UPDATE financial_documents 
SET 
    status = 'APPROVED',
    approved_by = 'john_manager',
    approved_at = NOW()
WHERE document_number = 'EXP-001';
```

### Step 3: Add to Next Customer Invoice (if billable)

```sql
-- Create invoice including the billable expense
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    customer_name, amount, status, document_date, due_date, description
) VALUES (
    'CUSTOMER_INVOICE',
    'INV-003',
    1,
    'Brand Website',
    'ABC Corp',
    1500.00,
    'APPROVED',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'Reimbursement for client site visit expenses'
);
```

### Step 4: View Final Project Financials

```sql
SELECT 
    'Revenue' as Type,
    SUM(amount) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')

UNION ALL

SELECT 
    'Costs' as Type,
    SUM(amount) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')

UNION ALL

SELECT 
    'Profit' as Type,
    (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')
    ) - (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')
    ) as Total;
```

**Expected Result:**
```
Type    | Total
--------+----------
Revenue | 101,500  (₹100,000 + ₹1,500 billable expense)
Costs   | 13,500   (₹12,000 vendor + ₹1,500 expense)
Profit  | 88,000
```

---

## 📊 COMPLETE PROJECT FINANCIAL SUMMARY

```sql
SELECT 
    fd.document_type,
    fd.document_number,
    fd.customer_name,
    fd.vendor_name,
    fd.employee_username,
    CASE 
        WHEN fd.document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN 'REVENUE'
        ELSE 'COST'
    END as cash_flow_type,
    fd.amount,
    fd.status,
    fd.description
FROM financial_documents fd
WHERE fd.project_id = 1
ORDER BY fd.document_date, fd.document_type;
```

**Expected Output:**
```
Type             | Number   | Party                      | Flow    | Amount  | Status
-----------------+----------+---------------------------+---------+---------+--------
SALES_ORDER      | SO-001   | ABC Corp                  | REVENUE | 100,000 | APPROVED
CUSTOMER_INVOICE | INV-001  | ABC Corp                  | REVENUE | 40,000  | APPROVED
CUSTOMER_INVOICE | INV-002  | ABC Corp                  | REVENUE | 60,000  | APPROVED
PURCHASE_ORDER   | PO-001   | Photography Studio        | COST    | 12,000  | APPROVED
VENDOR_BILL      | BILL-001 | Photography Studio        | COST    | 12,000  | APPROVED
EXPENSE          | EXP-001  | jane_dev                  | COST    | 1,500   | APPROVED
CUSTOMER_INVOICE | INV-003  | ABC Corp                  | REVENUE | 1,500   | APPROVED
```

---

## 🔌 API ENDPOINTS

### Create Sales Order
```http
POST /api/financial-documents
Content-Type: application/json
Authorization: Bearer {JWT}

{
  "documentType": "SALES_ORDER",
  "projectId": 1,
  "projectName": "Brand Website",
  "customerName": "ABC Corp",
  "amount": 100000.00,
  "documentDate": "2025-11-09",
  "description": "Fixed-price website project"
}
```

### Create Customer Invoice
```http
POST /api/financial-documents
Content-Type: application/json
Authorization: Bearer {JWT}

{
  "documentType": "CUSTOMER_INVOICE",
  "projectId": 1,
  "projectName": "Brand Website",
  "customerName": "ABC Corp",
  "amount": 40000.00,
  "milestoneName": "Design Phase",
  "documentDate": "2025-11-09",
  "dueDate": "2025-12-09",
  "description": "Invoice for Design milestone"
}
```

### Create Purchase Order
```http
POST /api/financial-documents
Content-Type: application/json
Authorization: Bearer {JWT}

{
  "documentType": "PURCHASE_ORDER",
  "projectId": 1,
  "projectName": "Brand Website",
  "vendorName": "Professional Photography Studio",
  "amount": 12000.00,
  "documentDate": "2025-11-09",
  "description": "Photography services"
}
```

### Create Expense
```http
POST /api/financial-documents
Content-Type: application/json
Authorization: Bearer {JWT}

{
  "documentType": "EXPENSE",
  "projectId": 1,
  "projectName": "Brand Website",
  "employeeUsername": "jane_dev",
  "amount": 1500.00,
  "isBillable": true,
  "documentDate": "2025-11-09",
  "description": "Travel to client site",
  "receiptUrl": "https://example.com/receipt.pdf"
}
```

### Get Project Financials
```http
GET /api/financial-documents/project/{projectId}/financials
Authorization: Bearer {JWT}

Response:
{
  "revenue": 101500.00,
  "costs": 13500.00,
  "profit": 88000.00
}
```

---

## 💻 USEFUL QUERIES

### Get All Documents for a Project
```sql
SELECT 
    document_type,
    document_number,
    COALESCE(customer_name, vendor_name, employee_username) as party,
    amount,
    status,
    document_date
FROM financial_documents
WHERE project_id = 1
ORDER BY document_date;
```

### Get Outstanding Invoices
```sql
SELECT 
    document_number,
    customer_name,
    amount,
    paid_amount,
    (amount - paid_amount) as outstanding,
    due_date,
    DATEDIFF(CURDATE(), due_date) as days_overdue
FROM financial_documents
WHERE document_type = 'CUSTOMER_INVOICE'
  AND status IN ('APPROVED', 'PARTIALLY_PAID')
ORDER BY due_date;
```

### Get Pending Expenses for Approval
```sql
SELECT 
    document_number,
    employee_username,
    amount,
    is_billable,
    description,
    document_date,
    receipt_url
FROM financial_documents
WHERE document_type = 'EXPENSE'
  AND status = 'PENDING'
ORDER BY document_date DESC;
```

### Company-Wide Financial Summary
```sql
SELECT 
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as total_costs,
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) - 
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as total_profit
FROM financial_documents;
```

### Cash Flow by Month
```sql
SELECT 
    DATE_FORMAT(document_date, '%Y-%m') as month,
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) as revenue,
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as costs,
    SUM(CASE WHEN document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE') THEN amount ELSE 0 END) - 
    SUM(CASE WHEN document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE') THEN amount ELSE 0 END) as profit
FROM financial_documents
GROUP BY DATE_FORMAT(document_date, '%Y-%m')
ORDER BY month DESC;
```

---

## 📋 SUMMARY

✅ **Financial Document Types**:
- Sales Orders (Revenue expectation)
- Customer Invoices (Revenue recognition)
- Purchase Orders (Cost expectation)
- Vendor Bills (Cost recognition)
- Expenses (Team costs)

✅ **Features**:
- Milestone-based invoicing
- Vendor management
- Expense tracking with approval
- Billable vs non-billable expenses
- Payment tracking
- Project profitability
- Cash flow management

✅ **Integration**:
- Links to Projects
- Links to Tasks
- Links to Timesheets
- Role-based access control
- Approval workflows

**Your complete financial management system is ready!** 🎉

Handle fixed-price projects, vendor bills, team expenses, and track profit accurately!
# 💰 FINANCIAL MANAGEMENT SYSTEM - Real-World Scenarios

## ✅ SYSTEM OVERVIEW

This system implements complete financial tracking for:
- **Sales Orders** (Revenue expectation)
- **Customer Invoices** (Revenue recognition)
- **Purchase Orders** (Cost expectation)
- **Vendor Bills** (Cost recognition)
- **Expenses** (Team expenses)

### Cash Flow Impact
- **Positive Cash Flow (Revenue)**: Sales Orders, Customer Invoices
- **Negative Cash Flow (Cost)**: Purchase Orders, Vendor Bills, Expenses
- **Profit** = Revenue - Costs

---

## 📊 DATABASE SCHEMA

### FINANCIAL_DOCUMENTS TABLE

```sql
CREATE TABLE financial_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Document Info
    document_type ENUM('SALES_ORDER', 'CUSTOMER_INVOICE', 'PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE'),
    document_number VARCHAR(100) UNIQUE,  -- SO-001, INV-001, PO-001, etc.
    
    -- Project Linkage
    project_id BIGINT,
    project_name VARCHAR(255),
    
    -- Parties
    customer_name VARCHAR(255),           -- For sales/invoices
    vendor_name VARCHAR(255),             -- For POs/bills
    employee_username VARCHAR(255),       -- For expenses
    
    -- Financial
    amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'),
    
    -- Dates
    document_date DATE NOT NULL,
    due_date DATE,
    
    -- Additional
    description TEXT,
    milestone_name VARCHAR(255),          -- For milestone-based invoicing
    is_billable BOOLEAN DEFAULT FALSE,    -- For expenses
    receipt_url VARCHAR(500),             -- For expenses
    
    -- Approval
    approved_by VARCHAR(255),
    approved_at DATETIME,
    
    -- Metadata
    created_by VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    
    -- Indexes
    INDEX idx_doc_type (document_type),
    INDEX idx_project_id (project_id),
    INDEX idx_status (status),
    INDEX idx_doc_date (document_date),
    
    -- Foreign Keys
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

---

## 🎯 SCENARIO 1: Fixed-Price Project

**Story**: Company sells "Brand Website" to customer for ₹1,00,000

### Step 1: Create Sales Order

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    customer_name, amount, status, document_date, description
) VALUES (
    'SALES_ORDER',
    'SO-001',
    1,
    'Brand Website',
    'ABC Corp',
    100000.00,
    'APPROVED',
    CURDATE(),
    'Fixed-price website project with design and build milestones'
);
```

### Step 2: Project Manager Adds Milestones

```sql
-- Milestone 1: Design (₹40,000)
-- Milestone 2: Build (₹60,000)
-- (These are tracked in project tasks/milestones)
```

### Step 3: Design Milestone Done - Create Customer Invoice

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    customer_name, amount, milestone_name, status, document_date, due_date, description
) VALUES (
    'CUSTOMER_INVOICE',
    'INV-001',
    1,
    'Brand Website',
    'ABC Corp',
    40000.00,
    'Design Phase',
    'APPROVED',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'Invoice for Design milestone completion'
);
```

### Step 4: Build Milestone Done - Create Customer Invoice

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    customer_name, amount, milestone_name, status, document_date, due_date, description
) VALUES (
    'CUSTOMER_INVOICE',
    'INV-002',
    1,
    'Brand Website',
    'ABC Corp',
    60000.00,
    'Build Phase',
    'APPROVED',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'Invoice for Build milestone completion'
);
```

### Step 5: View Project Overview

```sql
SELECT 
    'Revenue' as Type,
    SUM(amount) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')

UNION ALL

SELECT 
    'Costs' as Type,
    COALESCE(SUM(amount), 0) as Total
FROM financial_documents
WHERE project_id = 1 
  AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')

UNION ALL

SELECT 
    'Profit' as Type,
    (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('SALES_ORDER', 'CUSTOMER_INVOICE')
    ) - (
        SELECT COALESCE(SUM(amount), 0) FROM financial_documents 
        WHERE project_id = 1 AND document_type IN ('PURCHASE_ORDER', 'VENDOR_BILL', 'EXPENSE')
    ) as Total;
```

**Expected Result:**
```
Type    | Total
--------+----------
Revenue | 100,000
Costs   | 0
Profit  | 100,000
```

---

## 🎯 SCENARIO 2: Vendor Needed for Project

**Story**: Company needs photographer for ₹12,000

### Step 1: Create Purchase Order to Vendor

```sql
INSERT INTO financial_documents (
    document_type, document_number, project_id, project_name,
    vendor_name, amount, status, document_date, description
) VALUES (
    'PURCHASE_ORDER',
    'PO-001',
    1,
    'Brand Website',

