# ⚡ QUICK SETUP - FINANCIAL MANAGEMENT SYSTEM

## 🎯 3 STEPS TO GET IT RUNNING

### ✅ Step 1: Database Setup (5 min)

```bash
# Open MySQL
mysql -u root -p471@Root

# Select database
USE oneflow;
```

**Then run this SQL:**
```sql
-- Copy from oneflow/database_financial_documents.sql or paste below:

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

-- Insert demo data (3 scenarios)
INSERT INTO financial_documents VALUES
(NULL, 'SALES_ORDER', 'SO-001', 1, 'Brand Website', 'ABC Corp', NULL, NULL, 100000, 0, 'APPROVED', '2025-11-01', NULL, 'Brand Website project', NULL, FALSE, NULL, NULL, NULL, 'super', NOW(), NOW()),
(NULL, 'CUSTOMER_INVOICE', 'INV-001', 1, 'Brand Website', 'ABC Corp', NULL, NULL, 40000, 40000, 'PAID', '2025-11-15', '2025-12-15', 'Design milestone', 'Design Phase', FALSE, NULL, NULL, NULL, 'super', NOW(), NOW()),
(NULL, 'CUSTOMER_INVOICE', 'INV-002', 1, 'Brand Website', 'ABC Corp', NULL, NULL, 60000, 30000, 'PARTIALLY_PAID', '2025-12-01', '2025-12-31', 'Build milestone', 'Build Phase', FALSE, NULL, NULL, NULL, 'super', NOW(), NOW()),
(NULL, 'PURCHASE_ORDER', 'PO-001', 1, 'Brand Website', NULL, 'Professional Photography Studio', NULL, 12000, 0, 'APPROVED', '2025-11-10', NULL, 'Product photography', NULL, FALSE, NULL, NULL, NULL, 'super', NOW(), NOW()),
(NULL, 'VENDOR_BILL', 'BILL-001', 1, 'Brand Website', NULL, 'Professional Photography Studio', NULL, 12000, 12000, 'PAID', '2025-11-20', '2025-12-20', 'Photography completed', NULL, FALSE, NULL, NULL, NULL, 'super', NOW(), NOW()),
(NULL, 'EXPENSE', 'EXP-001', 1, 'Brand Website', NULL, NULL, 'jane_dev', 1500, 0, 'APPROVED', '2025-11-18', NULL, 'Client site visit', NULL, TRUE, NULL, 'john_manager', NOW(), 'jane_dev', NOW(), NOW());
```

**Verify:**
```sql
SELECT document_type, document_number, amount, status FROM financial_documents;
-- Should show 6 rows
```

---

### ✅ Step 2: Start Backend (2 min)

```bash
cd C:\Users\palak\OneDrive\Desktop\clone_1\oneflow
mvn spring-boot:run
```

**Wait for:**
```
Started OneflowApplication
```

**Backend runs on:** `http://localhost:8080`

**Test it:**
```
Open browser: http://localhost:8080/api/health
Should see: {"status":"UP"}
```

---

### ✅ Step 3: Access Frontend (1 min)

1. **Frontend should already be running**
   ```bash
   cd C:\Users\palak\OneDrive\Desktop\clone_1\frontend
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000/financials
   ```

3. **Sign in:**
   - Username: `super`
   - Password: your password
   - Role: SUPERADMIN

4. **You should see:**
   - ✅ 6 documents loaded from database
   - ✅ Project filter dropdown
   - ✅ Document tabs (All, Sales Orders, Invoices, etc.)
   - ✅ "+ Create Document" button

---

## 🧪 QUICK TEST

1. **View All Documents:**
   - Should see 6 documents in table
   - SO-001, INV-001, INV-002, PO-001, BILL-001, EXP-001

2. **Filter by Project:**
   - Select "Brand Website" from dropdown
   - See financial summary:
     * Revenue: ₹200,000
     * Costs: ₹25,500
     * Profit: ₹174,500

3. **Filter by Type:**
   - Click "Invoices" tab
   - See only INV-001 and INV-002

4. **Create New Document:**
   - Click "+ Create Document"
   - Select "Sales Order"
   - Fill: Project, Customer, Amount
   - Click "Create Document"
   - Alert shows: "SALES_ORDER SO-002 created successfully!"
   - New document appears in table

---

## ✅ SUCCESS CHECKLIST

- [ ] Database table created
- [ ] 6 demo documents inserted
- [ ] Backend running (port 8080)
- [ ] Frontend running (port 3000)
- [ ] Signed in as SUPERADMIN
- [ ] Can see 6 documents
- [ ] Can filter by project
- [ ] Can create new document
- [ ] Financial calculations work

---

## 🚀 ALL DONE!

Your financial management system is now:
- ✅ Connected to MySQL database
- ✅ Loading real data from backend
- ✅ Creating documents that save to database
- ✅ Calculating project profitability
- ✅ All 3 business scenarios working

**Total setup time: ~10 minutes** ⚡

**Access now:** `http://localhost:3000/financials`

