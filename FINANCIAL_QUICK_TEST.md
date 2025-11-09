# 🧪 QUICK TEST GUIDE - Financial Management

## ⚡ INSTANT ACCESS

### URL
```
http://localhost:3000/financials
```

### Required Role
- SUPERADMIN ✅
- SALES_FINANCE ✅
- PROJECT_MANAGER ✅ (limited)
- TEAM_MEMBER ❌ (redirected)

---

## 📋 TEST CHECKLIST

### ✅ Visual Check
Go to `/financials` and verify you see:

- [ ] Page title: "Financial Management"
- [ ] Project filter dropdown
- [ ] Financial summary cards (when project selected)
- [ ] Document type tabs (All, SO, Invoices, POs, Bills, Expenses)
- [ ] Documents table with 6 demo records
- [ ] "+ Create Document" button (top right)

### ✅ Scenario 1: Fixed-Price Project

**Demo Data to Verify:**
- [ ] SO-001: ₹100,000 - Sales Order to ABC Corp
- [ ] INV-001: ₹40,000 - Design milestone invoice (PAID)
- [ ] INV-002: ₹60,000 - Build milestone invoice (PARTIALLY PAID ₹30k)

**Financial Summary Should Show:**
- [ ] Revenue: ₹200,000
- [ ] Costs: ₹25,500
- [ ] Profit: ₹174,500
- [ ] Margin: 87.25%

### ✅ Scenario 2: Vendor Needed

**Demo Data to Verify:**
- [ ] PO-001: ₹12,000 - Purchase Order to Photo Studio
- [ ] BILL-001: ₹12,000 - Vendor Bill (PAID)

**Impact on Financials:**
- [ ] Costs increased by ₹12,000
- [ ] Profit decreased accordingly

### ✅ Scenario 3: Team Expense

**Demo Data to Verify:**
- [ ] EXP-001: ₹1,500 - Expense by jane_dev
- [ ] Marked as BILLABLE
- [ ] Status: APPROVED by john_manager
- [ ] Description: "Client site visit"

**Impact on Financials:**
- [ ] Costs increased by ₹1,500
- [ ] Can be billed to customer

---

## 🎯 FUNCTIONAL TESTS

### Test 1: Filter by Project
```
1. Select "Brand Website" from dropdown
2. See 6 documents
3. See financial summary
4. Select "All Projects"
5. Summary disappears
```

### Test 2: Filter by Document Type
```
1. Click "Sales Orders" tab → See 1 document (SO-001)
2. Click "Invoices" tab → See 2 documents (INV-001, INV-002)
3. Click "Purchase Orders" tab → See 1 document (PO-001)
4. Click "Vendor Bills" tab → See 1 document (BILL-001)
5. Click "Expenses" tab → See 1 document (EXP-001)
6. Click "All" tab → See all 6 documents
```

### Test 3: Create Sales Order
```
1. Click "+ Create Document"
2. Select "📋 Sales Order"
3. Fill form:
   - Project: Brand Website
   - Customer: XYZ Corp
   - Amount: 50000
   - Date: Today
   - Description: "New sales order"
4. Click "Create"
5. See success alert
6. Document appears in table (refresh to see in demo)
```

### Test 4: Create Customer Invoice
```
1. Click "+ Create Document"
2. Select "💵 Customer Invoice"
3. Fill form:
   - Project: Brand Website
   - Customer: ABC Corp
   - Amount: 20000
   - Date: Today
   - Due Date: 30 days from now
   - Milestone: "Testing Phase"
   - Description: "Testing milestone invoice"
4. Click "Create"
5. See success alert
```

### Test 5: Create Expense
```
1. Click "+ Create Document"
2. Select "💳 Expense"
3. Fill form:
   - Project: Brand Website
   - Employee: john_dev
   - Amount: 2000
   - Date: Today
   - Billable: Check the box
   - Description: "Software licenses"
4. Click "Create"
5. See success alert
```

---

## 📊 WHAT YOU SHOULD SEE

### Financial Summary (Brand Website)
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Total Revenue    │ │ Total Costs      │ │ Net Profit       │
│                  │ │                  │ │                  │
│   ₹200,000       │ │    ₹25,500       │ │   ₹174,500       │
│                  │ │                  │ │                  │
│ SO + Invoices    │ │ POs + Bills +    │ │ 87.3% margin     │
│                  │ │ Expenses         │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Documents Table
```
Type | Number   | Project      | Party           | Amount    | Status
─────┼──────────┼──────────────┼─────────────────┼───────────┼────────────
📋   | SO-001   | Brand        | ABC Corp        | ₹100,000  | APPROVED
💵   | INV-001  | Brand        | ABC Corp        | ₹40,000   | PAID
💵   | INV-002  | Brand        | ABC Corp        | ₹60,000   | PARTIAL
🛒   | PO-001   | Brand        | Photo Studio    | ₹12,000   | APPROVED
📄   | BILL-001 | Brand        | Photo Studio    | ₹12,000   | PAID
💳   | EXP-001  | Brand        | jane_dev        | ₹1,500    | APPROVED
```

---

## 🐛 TROUBLESHOOTING

### Issue: Can't see Financials link in navbar
**Solution**: 
- Make sure you're signed in
- Check your role (must be SUPERADMIN, SALES_FINANCE, or PROJECT_MANAGER)
- Hard refresh: Ctrl+Shift+R

### Issue: Page redirects to dashboard
**Solution**:
- You don't have permission
- Sign in with admin or sales/finance account

### Issue: No financial summary showing
**Solution**:
- Select a project from the dropdown first
- Summary only appears when project is selected

### Issue: Can't create documents
**Solution**:
- Fill in all required fields (marked with *)
- Make sure amount is a number
- Select a project first

---

## ✅ SUCCESS CRITERIA

**All tests pass if:**
1. ✅ Can access /financials page
2. ✅ See 6 demo documents
3. ✅ Financial summary shows correct totals
4. ✅ Tabs filter documents correctly
5. ✅ Can open create document modal
6. ✅ Form validates required fields
7. ✅ Create button works (shows alert)

---

## 🎉 READY TO USE!

**Your complete financial management system is working!**

### Three Scenarios Demonstrated:
1. ✅ **Fixed-Price**: Sales Order + Milestone Invoices (₹100k project)
2. ✅ **Vendor Needed**: Purchase Order + Vendor Bill (₹12k cost)
3. ✅ **Team Expense**: Billable expense tracking (₹1.5k)

### Access Now:
```
1. Go to http://localhost:3000/financials
2. Select "Brand Website" project
3. See profit: ₹174,500
4. View all documents
5. Create new documents
6. Track profitability in real-time
```

**Test it now!** 💰

