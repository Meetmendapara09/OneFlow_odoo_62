# ✅ TODAY'S ACTION ITEMS - Financial Management

## 🎯 IMMEDIATE NEXT STEPS (Do These Now)

### ⚡ Step 1: Create Database Table (5 minutes)

```bash
# Open MySQL
mysql -u root -p471@Root

# Select database
USE oneflow;

# Create financial_documents table
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

# Verify table created
SHOW TABLES;
DESCRIBE financial_documents;
```

**Expected Result:** Table `financial_documents` created successfully ✅

---

### ⚡ Step 2: Insert Demo Data (3 minutes)

```sql
-- Still in MySQL console:

-- Sales Order
INSERT INTO financial_documents 
(document_type, document_number, project_id, project_name, customer_name, amount, status, document_date, description, created_by)
VALUES 
('SALES_ORDER', 'SO-001', 1, 'Brand Website', 'ABC Corp', 100000, 'APPROVED', '2025-11-01', 'Brand Website project for ABC Corp', 'sales_user');

-- Customer Invoices
INSERT INTO financial_documents 
(document_type, document_number, project_id, project_name, customer_name, amount, paid_amount, status, document_date, due_date, milestone_name, description, created_by)
VALUES 
('CUSTOMER_INVOICE', 'INV-001', 1, 'Brand Website', 'ABC Corp', 40000, 40000, 'PAID', '2025-11-15', '2025-12-15', 'Design Phase', 'Invoice for Design milestone', 'sales_user'),
('CUSTOMER_INVOICE', 'INV-002', 1, 'Brand Website', 'ABC Corp', 60000, 30000, 'PARTIALLY_PAID', '2025-12-01', '2025-12-31', 'Build Phase', 'Invoice for Build milestone', 'sales_user');

-- Purchase Order & Vendor Bill
INSERT INTO financial_documents 
(document_type, document_number, project_id, project_name, vendor_name, amount, status, document_date, description, created_by)
VALUES 
('PURCHASE_ORDER', 'PO-001', 1, 'Brand Website', 'Professional Photography Studio', 12000, 'APPROVED', '2025-11-10', 'Product photography', 'john_manager'),
('VENDOR_BILL', 'BILL-001', 1, 'Brand Website', 'Professional Photography Studio', 12000, 'PAID', '2025-11-20', 'Photography work completed', 'finance_user');

-- Set paid amount for vendor bill
UPDATE financial_documents SET paid_amount = 12000 WHERE document_number = 'BILL-001';

-- Expense
INSERT INTO financial_documents 
(document_type, document_number, project_id, project_name, employee_username, amount, status, document_date, is_billable, description, approved_by, approved_at, created_by)
VALUES 
('EXPENSE', 'EXP-001', 1, 'Brand Website', 'jane_dev', 1500, 'APPROVED', '2025-11-18', TRUE, 'Client site visit - travel', 'john_manager', NOW(), 'jane_dev');

-- Verify data inserted
SELECT document_type, document_number, amount, status FROM financial_documents;
```

**Expected Result:** 6 rows inserted ✅

---

### ⚡ Step 3: Verify Backend is Running (2 minutes)

```bash
# Open new terminal
cd C:\Users\palak\OneDrive\Desktop\clone_1\oneflow

# Start backend
mvn spring-boot:run

# Wait for "Started OneflowApplication"
```

**Expected Result:** Backend running on port 8080 ✅

---

### ⚡ Step 4: Test Backend API (2 minutes)

```powershell
# In PowerShell, test if API returns data

# First, sign in and get token
$body = '{"username":"super","password":"YOUR_PASSWORD"}'
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/signin' -Method POST -Body $body -ContentType 'application/json'
$token = $response.token
$headers = @{Authorization = "Bearer $token"}

# Test financial documents endpoint
Invoke-RestMethod -Uri 'http://localhost:8080/api/financial-documents' -Headers $headers

# Should see 6 documents returned
```

**Expected Result:** JSON array with 6 documents ✅

---

### ⚡ Step 5: Update Frontend to Use Real API (10 minutes)

Open `frontend/app/financials/page.tsx` and update:

**Find line ~52 (fetchData function):**

Replace this:
```typescript
const mockDocuments: FinancialDocument[] = [
  // ... mock data
];
```

With this:
```typescript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/financial-documents', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
const mockDocuments: FinancialDocument[] = data;
```

**Find line ~185 (handleSubmit function):**

Replace this:
```typescript
console.log("Creating document:", formData);
// TODO: API integration
alert(`${formData.documentType} created successfully!`);
```

With this:
```typescript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/financial-documents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    documentType: formData.documentType,
    projectId: parseInt(formData.projectId),
    projectName: formData.projectName,
    customerName: formData.customerName,
    vendorName: formData.vendorName,
    employeeUsername: formData.employeeUsername,
    amount: parseFloat(formData.amount),
    documentDate: formData.documentDate,
    dueDate: formData.dueDate || null,
    description: formData.description,
    milestoneName: formData.milestoneName,
    isBillable: formData.isBillable,
    status: 'DRAFT',
    createdBy: user?.username
  })
});

if (!response.ok) {
  throw new Error('Failed to create document');
}

alert(`${formData.documentType} created successfully!`);
```

**Expected Result:** Frontend now fetches real data from backend ✅

---

### ⚡ Step 6: Test End-to-End (5 minutes)

```
1. Make sure backend is running (Step 3)
2. Go to: http://localhost:3000/financials
3. Sign in as SUPERADMIN
4. Select "Brand Website" from dropdown
5. See 6 documents in table (from database!)
6. See financial summary:
   - Revenue: ₹200,000
   - Costs: ₹25,500
   - Profit: ₹174,500
7. Click "+ Create Document"
8. Create a new Sales Order
9. See it appear in table
10. Check database: SELECT * FROM financial_documents;
```

**Expected Result:** Everything works with real database! ✅

---

## 📋 COMPLETION CHECKLIST

- [ ] Database table created
- [ ] Demo data inserted (6 records)
- [ ] Backend running on port 8080
- [ ] Backend API returns data
- [ ] Frontend updated to call real API
- [ ] Can view documents from database
- [ ] Can create new documents (saves to DB)
- [ ] Financial calculations work
- [ ] All 3 scenarios visible with real data

---

## 🎯 AFTER COMPLETING THESE STEPS

You'll have:
✅ Fully functional financial management system
✅ Real database integration
✅ All 3 scenarios working end-to-end
✅ Create/Read functionality working
✅ Profit calculations with real data

---

## 🚀 THEN MOVE TO NEXT PHASE

**Phase 2: Enhanced Features**
- Document details view
- Payment recording
- Approval workflow
- File uploads for receipts
- Export to PDF

**Phase 3: Reports & Analytics**
- Profit & Loss reports
- Revenue trends
- Expense reports
- Dashboard widgets

---

## 💡 TIPS

**Database Connection Issues?**
```bash
# Check MySQL is running
mysql -u root -p471@Root

# Verify oneflow database exists
SHOW DATABASES;
USE oneflow;
SHOW TABLES;
```

**Backend Errors?**
```bash
# Check application.properties
# Make sure DB credentials are correct
spring.datasource.username=root
spring.datasource.password=471@Root
```

**Frontend Not Fetching Data?**
```typescript
// Add error logging
try {
  const response = await fetch('...');
  console.log('Response:', response);
  const data = await response.json();
  console.log('Data:', data);
} catch (error) {
  console.error('Error:', error);
}
```

---

## ⏱️ TIME ESTIMATE

- Step 1: 5 min (Create table)
- Step 2: 3 min (Insert data)
- Step 3: 2 min (Start backend)
- Step 4: 2 min (Test API)
- Step 5: 10 min (Update frontend)
- Step 6: 5 min (Test E2E)

**Total: ~30 minutes to full integration!** ⚡

---

## 🎉 YOU'RE READY!

Start with Step 1 and work through each step in order. By the end, you'll have a fully functional, database-backed financial management system!

**Questions?** Check NEXT_STEPS_ROADMAP.md for detailed explanations.

**Ready to start?** Open MySQL and run the CREATE TABLE command! 🚀

