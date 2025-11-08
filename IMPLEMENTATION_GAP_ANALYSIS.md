# OneFlow Implementation Gap Analysis

## Current Implementation Status

### ✅ Completed Features

#### Authentication & Access

- ✅ Login/Signup pages with professional UI
- ✅ Forgot password page
- ✅ JWT-based authentication (backend)
- ✅ Role-based access control structure (backend)

#### Projects Module

- ✅ Project listing page with filters
- ✅ Project detail page
- ✅ Project CRUD operations (frontend + backend)
- ✅ Project progress tracking
- ✅ Project status management (Planned, In Progress, Completed, On Hold)

#### Tasks Module

- ✅ Task listing page with filters
- ✅ Task detail page
- ✅ Task CRUD operations (frontend + backend)
- ✅ Task states (New, In Progress, Blocked, Done)
- ✅ Task assignment to users
- ✅ Task priority management (High, Medium, Low)
- ✅ Task filtering (My Tasks / All Tasks)

#### Dashboard & Analytics

- ✅ Dashboard with KPI widgets
- ✅ Analytics page with charts
- ✅ Project/Task statistics

#### Profile

- ✅ User profile management page

---

## ❌ Missing Core Features (High Priority)

### 1. Financial Management Module

#### 1.1 Sales Orders (SO)

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: SalesOrder.java
- id, orderNumber, customerId, customerName
- projectId (FK to Project)
- orderDate, deliveryDate
- totalAmount, currency
- status (Draft, Confirmed, In Progress, Done, Cancelled)
- items (List<SalesOrderLine>)
- createdAt, updatedAt

Model: SalesOrderLine.java
- id, salesOrderId (FK)
- productId, productName, description
- quantity, unitPrice, subtotal
- milestoneId (optional FK to Milestone)
```

**Frontend Required**:

- `/app/sales-orders/page.tsx` - List all SOs with search/filter/group
- `/app/sales-orders/[id]/page.tsx` - SO detail/edit form
- `/app/sales-orders/new/page.tsx` - Create new SO
- Component: `SalesOrderCard.tsx` for displaying SO in project

**API Endpoints**:

```
GET    /api/sales-orders
GET    /api/sales-orders/{id}
POST   /api/sales-orders
PUT    /api/sales-orders/{id}
DELETE /api/sales-orders/{id}
GET    /api/sales-orders/project/{projectId}
```

---

#### 1.2 Purchase Orders (PO)

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: PurchaseOrder.java
- id, orderNumber, vendorId, vendorName
- projectId (FK to Project)
- orderDate, expectedDate
- totalAmount, currency
- status (RFQ, Purchase Order, Received, Cancelled)
- items (List<PurchaseOrderLine>)
- createdAt, updatedAt

Model: PurchaseOrderLine.java
- id, purchaseOrderId (FK)
- productId, productName, description
- quantity, unitPrice, subtotal
```

**Frontend Required**:

- `/app/purchase-orders/page.tsx` - List all POs
- `/app/purchase-orders/[id]/page.tsx` - PO detail/edit
- `/app/purchase-orders/new/page.tsx` - Create PO
- Component: `PurchaseOrderCard.tsx`

**API Endpoints**:

```
GET    /api/purchase-orders
GET    /api/purchase-orders/{id}
POST   /api/purchase-orders
PUT    /api/purchase-orders/{id}
DELETE /api/purchase-orders/{id}
GET    /api/purchase-orders/project/{projectId}
```

---

#### 1.3 Customer Invoices

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: CustomerInvoice.java
- id, invoiceNumber, customerId, customerName
- projectId (FK to Project)
- salesOrderId (FK to SalesOrder, optional)
- invoiceDate, dueDate, paidDate
- totalAmount, paidAmount, currency
- status (Draft, Posted, Paid, Cancelled)
- items (List<InvoiceLine>)
- createdAt, updatedAt

Model: InvoiceLine.java
- id, invoiceId (FK)
- description, quantity, unitPrice, subtotal
- taskId (optional FK), milestoneId (optional)
```

**Frontend Required**:

- `/app/invoices/page.tsx` - List all invoices
- `/app/invoices/[id]/page.tsx` - Invoice detail/edit
- `/app/invoices/new/page.tsx` - Create invoice
- Component: `InvoiceCard.tsx`

**API Endpoints**:

```
GET    /api/invoices
GET    /api/invoices/{id}
POST   /api/invoices
PUT    /api/invoices/{id}
DELETE /api/invoices/{id}
GET    /api/invoices/project/{projectId}
POST   /api/invoices/from-sales-order/{soId}
```

---

#### 1.4 Vendor Bills

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: VendorBill.java
- id, billNumber, vendorId, vendorName
- projectId (FK to Project)
- purchaseOrderId (FK to PurchaseOrder, optional)
- billDate, dueDate, paidDate
- totalAmount, paidAmount, currency
- status (Draft, Posted, Paid, Cancelled)
- items (List<BillLine>)
- createdAt, updatedAt

Model: BillLine.java
- id, billId (FK)
- description, quantity, unitPrice, subtotal
- purchaseOrderLineId (optional FK)
```

**Frontend Required**:

- `/app/vendor-bills/page.tsx` - List all bills
- `/app/vendor-bills/[id]/page.tsx` - Bill detail/edit
- `/app/vendor-bills/new/page.tsx` - Create bill
- Component: `VendorBillCard.tsx`

**API Endpoints**:

```
GET    /api/vendor-bills
GET    /api/vendor-bills/{id}
POST   /api/vendor-bills
PUT    /api/vendor-bills/{id}
DELETE /api/vendor-bills/{id}
GET    /api/vendor-bills/project/{projectId}
POST   /api/vendor-bills/from-purchase-order/{poId}
```

---

#### 1.5 Expenses

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: Expense.java
- id, expenseNumber
- projectId (FK to Project)
- taskId (FK to Task, optional)
- userId (FK to User) - who submitted
- expenseDate, submittedDate, approvedDate
- amount, currency
- category (Travel, Food, Supplies, Software, Other)
- description
- receipt (file path/URL)
- status (Draft, Submitted, Approved, Rejected, Reimbursed)
- billable (boolean) - can be charged to customer
- approvedBy (FK to User)
- createdAt, updatedAt
```

**Frontend Required**:

- `/app/expenses/page.tsx` - List all expenses
- `/app/expenses/[id]/page.tsx` - Expense detail/edit
- `/app/expenses/new/page.tsx` - Submit expense
- Component: `ExpenseCard.tsx`

**API Endpoints**:

```
GET    /api/expenses
GET    /api/expenses/{id}
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
GET    /api/expenses/project/{projectId}
POST   /api/expenses/{id}/approve
POST   /api/expenses/{id}/reject
GET    /api/expenses/my-expenses
```

---

### 2. Timesheets Module

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: Timesheet.java
- id, userId (FK to User)
- taskId (FK to Task)
- projectId (FK to Project)
- date, hours
- description
- billable (boolean)
- status (Draft, Submitted, Approved)
- hourlyRate (decimal) - for cost calculation
- createdAt, updatedAt

Model: UserRate.java
- id, userId (FK to User)
- hourlyRate, currency
- effectiveFrom, effectiveTo
```

**Frontend Required**:

- `/app/timesheets/page.tsx` - Timesheet entry page
- `/app/timesheets/week/page.tsx` - Weekly timesheet view
- Component: `TimesheetTable.tsx` - Grid for hour entry
- Component: `TimesheetCard.tsx` - Display in task detail

**API Endpoints**:

```
GET    /api/timesheets
GET    /api/timesheets/{id}
POST   /api/timesheets
PUT    /api/timesheets/{id}
DELETE /api/timesheets/{id}
GET    /api/timesheets/task/{taskId}
GET    /api/timesheets/project/{projectId}
GET    /api/timesheets/user/{userId}
GET    /api/timesheets/user/{userId}/week/{date}
POST   /api/timesheets/submit
```

---

### 3. Project Financial Overview

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Service: ProjectFinancialService.java
Methods:
- calculateProjectRevenue(projectId) -> total from Customer Invoices
- calculateProjectCost(projectId) -> total from Vendor Bills + Expenses + Timesheets
- calculateProjectProfit(projectId) -> Revenue - Cost
- getProjectFinancialSummary(projectId) -> detailed breakdown

Update Project.java with:
- budget (decimal)
- spent (decimal)
- revenue (decimal)
- profit (decimal)
```

**Frontend Required**:

- Update `/app/projects/[id]/page.tsx` to show:
  - Financial summary cards (Revenue, Cost, Profit, Budget)
  - Linked documents section (SOs, POs, Invoices, Bills, Expenses)
  - "Links" panel in top bar
- Component: `ProjectFinancialSummary.tsx`
- Component: `LinkedDocumentsPanel.tsx`

**API Endpoints**:

```
GET /api/projects/{id}/financial-summary
GET /api/projects/{id}/linked-documents
```

---

### 4. Project Settings & Linking

**Status**: ❌ Not Implemented

**Frontend Required**:

- `/app/projects/[id]/settings/page.tsx` - Project settings page
  - Section: Link/Create Sales Orders
  - Section: Link/Create Purchase Orders
  - Section: Link/Create Invoices
  - Section: Link/Create Vendor Bills
  - Section: Link/Create Expenses
- Component: `DocumentLinkModal.tsx` - For linking existing documents

---

### 5. Global Financial Menus

**Status**: ❌ Not Implemented

**Frontend Required**:

- Update `/app/layout.tsx` sidebar navigation to add:
  - Sales Orders
  - Purchase Orders
  - Customer Invoices
  - Vendor Bills
  - Expenses
  - Timesheets

Each menu shows global list with:

- Search functionality
- Filters (date, partner, state, project)
- Group by (project, partner, state)
- Create new button
- Link to project button

---

### 6. Enhanced Project Features

#### 6.1 Milestones

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: Milestone.java
- id, projectId (FK)
- name, description
- targetDate, completedDate
- status (Pending, In Progress, Completed)
- amount (for invoicing)
- invoiceId (FK to CustomerInvoice, optional)
```

#### 6.2 Team Members Management

**Status**: ⚠️ Partially Implemented (only assignee field)

**Backend Required**:

```java
Model: ProjectMember.java
- id, projectId (FK)
- userId (FK)
- role (Manager, Member, Viewer)
- hourlyRate (optional override)
- joinedDate
```

---

### 7. Enhanced Task Features

#### 7.1 Task Hour Logging

**Status**: ❌ Not Implemented (mentioned in UI but not functional)

**Needs Integration**:

- Link Task detail page to Timesheets
- Add "Log Hours" button that opens timesheet modal
- Display logged hours summary in task detail

#### 7.2 Task Comments & Attachments

**Status**: ❌ Not Implemented

**Backend Required**:

```java
Model: TaskComment.java
- id, taskId (FK)
- userId (FK)
- comment, createdAt

Model: TaskAttachment.java
- id, taskId (FK)
- fileName, filePath, uploadedBy, uploadedAt
```

---

### 8. Dashboard Enhancements

#### 8.1 Missing KPIs

**Status**: ⚠️ Partial

Current KPIs are static mock data. Need:

- ❌ Billable vs Non-billable Hours
- ❌ Revenue Earned (real data from invoices)
- ❌ Project Cost vs Revenue charts
- ❌ Resource Utilization (based on timesheets)

---

## 📊 Priority Implementation Roadmap

### Phase 1: Critical Financial Foundation (Week 1-2)

1. ✅ Timesheets Module (backend + frontend)
2. ✅ Expenses Module (backend + frontend)
3. ✅ Project Financial Summary (backend service)

### Phase 2: Sales & Invoicing (Week 3-4)

4. ✅ Sales Orders (backend + frontend)
5. ✅ Customer Invoices (backend + frontend)
6. ✅ Link SOs to Projects
7. ✅ Generate Invoices from SOs

### Phase 3: Purchasing (Week 5)

8. ✅ Purchase Orders (backend + frontend)
9. ✅ Vendor Bills (backend + frontend)
10. ✅ Link POs to Projects

### Phase 4: Integration & Polish (Week 6)

11. ✅ Project Settings page with all linking
12. ✅ Links panel in project top bar
13. ✅ Update Analytics with real financial data
14. ✅ Enhanced Dashboard KPIs

### Phase 5: Additional Features (Week 7-8)

15. ✅ Milestones
16. ✅ Task Comments & Attachments
17. ✅ Project Team Management
18. ✅ File Upload for receipts/attachments

---

## 🔧 Technical Architecture Additions Needed

### Backend

- Add financial repositories (SalesOrderRepository, etc.)
- Add financial services (FinancialCalculationService)
- Add financial controllers
- Add file upload support (for receipts/attachments)
- Add aggregation queries for financial reporting

### Frontend

- Add financial pages (6 new modules)
- Add financial components (cards, forms, modals)
- Update API client with new endpoints
- Add file upload components
- Update layout navigation

### Database

- Create 10+ new tables
- Add foreign key relationships
- Add indexes for performance
- Migration scripts

---

## 📈 Current Completion Percentage

- **Authentication & Core UI**: 95% ✅
- **Projects Module**: 70% ⚠️ (missing financial linking)
- **Tasks Module**: 65% ⚠️ (missing timesheets, comments, attachments)
- **Financial Modules**: 0% ❌
- **Timesheets**: 0% ❌
- **Analytics**: 40% ⚠️ (static data, needs real financial data)
- **Overall Project**: ~35% Complete

---

## Next Steps

1. **Start with Timesheets** - Most critical for hour tracking
2. **Build Expenses** - Required for cost tracking
3. **Implement Sales Orders** - Foundation for revenue
4. **Complete Invoicing** - Required for billing
5. **Add Purchasing** - Complete the cost side
6. **Integrate everything** - Make modules talk to each other

Would you like me to start implementing any specific module?
