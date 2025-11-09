"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface FinancialDocument {
  id: number;
  documentType: string;
  documentNumber: string;
  projectId?: number;
  projectName?: string;
  customerName?: string;
  vendorName?: string;
  employeeUsername?: string;
  amount: number;
  paidAmount?: number;
  status: string;
  documentDate: string;
  dueDate?: string;
  description?: string;
  milestoneName?: string;
  isBillable?: boolean;
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface Project {
  id: number;
  name: string;
}

export default function FinancialsPage() {
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [financials, setFinancials] = useState({ revenue: 0, costs: 0, profit: 0 });

  const [formData, setFormData] = useState({
    documentType: "SALES_ORDER",
    projectId: "",
    projectName: "",
    customerName: "",
    vendorName: "",
    employeeUsername: "",
    amount: "",
    documentDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    description: "",
    milestoneName: "",
    isBillable: false,
    receiptUrl: ""
  });

  // Check authorization
  useEffect(() => {
    if (!isAuthenticated) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    if (!hasAnyRole(['SUPERADMIN', 'SALES_FINANCE', 'PROJECT_MANAGER'])) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    setAccessDenied(false);
  }, [isAuthenticated, user, hasAnyRole]);

  // Fetch data when authorized
  useEffect(() => {
    if (!accessDenied && isAuthenticated) {
      fetchData();
    }
  }, [activeTab, selectedProject, accessDenied, isAuthenticated]);

  // Fetch projects and documents from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        setAccessDenied(true);
        return;
      }

      // Fetch projects
      const projectsResponse = await fetch('http://localhost:8080/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);

      // Fetch documents
      let documentsUrl = 'http://localhost:8080/api/financial-documents';
      if (activeTab !== 'ALL') {
        documentsUrl = `http://localhost:8080/api/financial-documents/type/${activeTab}`;
      }
      if (selectedProject) {
        documentsUrl = `http://localhost:8080/api/financial-documents/project/${selectedProject}`;
      }

      const docsResponse = await fetch(documentsUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!docsResponse.ok) throw new Error('Failed to fetch documents');
      const docsData = await docsResponse.json();
      setDocuments(docsData);

      // Fetch project financials if project selected
      if (selectedProject) {
        const finResponse = await fetch(
          `http://localhost:8080/api/financial-documents/project/${selectedProject}/financials`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (finResponse.ok) {
          const finData = await finResponse.json();
          setFinancials(finData);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load financial data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: string) => {
    setModalType(type);
    setFormData({
      ...formData,
      documentType: type,
      projectId: selectedProject?.toString() || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in again');
        return;
      }

      const response = await fetch('http://localhost:8080/api/financial-documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentType: formData.documentType,
          projectId: parseInt(formData.projectId) || null,
          projectName: formData.projectName,
          customerName: formData.customerName || null,
          vendorName: formData.vendorName || null,
          employeeUsername: formData.employeeUsername || null,
          amount: parseFloat(formData.amount),
          documentDate: formData.documentDate,
          dueDate: formData.dueDate || null,
          description: formData.description,
          milestoneName: formData.milestoneName || null,
          isBillable: formData.isBillable,
          status: 'DRAFT'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const created = await response.json();
      alert(`${formData.documentType} ${created.documentNumber} created successfully!`);
      setShowModal(false);
      resetForm();
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      documentType: "SALES_ORDER",
      projectId: "",
      projectName: "",
      customerName: "",
      vendorName: "",
      employeeUsername: "",
      amount: "",
      documentDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      description: "",
      milestoneName: "",
      isBillable: false,
      receiptUrl: ""
    });
  };

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "SALES_ORDER": return "📋";
      case "CUSTOMER_INVOICE": return "💵";
      case "PURCHASE_ORDER": return "🛒";
      case "VENDOR_BILL": return "📄";
      case "EXPENSE": return "💳";
      default: return "📄";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return "badge-success";
      case "APPROVED": return "badge-primary";
      case "PARTIALLY_PAID": return "badge-warning";
      case "PENDING": return "badge-info";
      case "DRAFT": return "badge-neutral";
      case "CANCELLED": return "badge-error";
      default: return "badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-2xl w-full">
          <div className="card-body">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="card-title text-2xl justify-center mb-4">Access Denied</h2>

            {!isAuthenticated ? (
              <div className="space-y-4">
                <div className="alert alert-warning">
                  <div>
                    <h3 className="font-bold">Not Signed In</h3>
                    <div className="text-sm">You must be signed in to access Financial Management.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => router.push('/signin')} className="btn btn-primary flex-1">Sign In</button>
                  <button onClick={() => router.push('/dashboard')} className="btn btn-ghost flex-1">Dashboard</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="alert alert-error">
                  <div>
                    <h3 className="font-bold">Insufficient Permissions</h3>
                    <div className="text-sm">Role: {user?.role} - Access denied</div>
                  </div>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Required Roles:</p>
                  <ul className="list-disc list-inside text-sm">
                    <li>SUPERADMIN</li>
                    <li>SALES_FINANCE</li>
                    <li>PROJECT_MANAGER</li>
                  </ul>
                </div>
                <button onClick={() => router.push('/dashboard')} className="btn btn-primary w-full">Go to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted mt-1">Manage sales orders, invoices, purchase orders, bills, and expenses</p>
        </div>
        {hasAnyRole(['SUPERADMIN', 'SALES_FINANCE']) && (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Document
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 mt-2 z-50">
              <li><a onClick={() => handleOpenModal('SALES_ORDER')}>📋 Sales Order</a></li>
              <li><a onClick={() => handleOpenModal('CUSTOMER_INVOICE')}>💵 Customer Invoice</a></li>
              <li><a onClick={() => handleOpenModal('PURCHASE_ORDER')}>🛒 Purchase Order</a></li>
              <li><a onClick={() => handleOpenModal('VENDOR_BILL')}>📄 Vendor Bill</a></li>
              <li><a onClick={() => handleOpenModal('EXPENSE')}>💳 Expense</a></li>
            </ul>
          </div>
        )}
      </div>

      {/* Project Filter */}
      <div className="card">
        <div className="card-body">
          <label className="label"><span className="label-text">Filter by Project</span></label>
          <select
            className="select select-bordered w-full max-w-md"
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Summary */}
      {selectedProject && (
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-success">₹{financials.revenue.toLocaleString()}</div>
            <div className="stat-desc">Sales Orders + Invoices</div>
          </div>
          <div className="stat">
            <div className="stat-title">Total Costs</div>
            <div className="stat-value text-error">₹{financials.costs.toLocaleString()}</div>
            <div className="stat-desc">POs + Bills + Expenses</div>
          </div>
          <div className="stat">
            <div className="stat-title">Net Profit</div>
            <div className="stat-value text-primary">₹{financials.profit.toLocaleString()}</div>
            <div className="stat-desc">{financials.revenue > 0 ? ((financials.profit / financials.revenue) * 100).toFixed(1) : 0}% margin</div>
          </div>
        </div>
      )}

      {/* Document Tabs */}
      <div className="tabs tabs-boxed">
        <a className={`tab ${activeTab === 'ALL' ? 'tab-active' : ''}`} onClick={() => setActiveTab('ALL')}>All</a>
        <a className={`tab ${activeTab === 'SALES_ORDER' ? 'tab-active' : ''}`} onClick={() => setActiveTab('SALES_ORDER')}>Sales Orders</a>
        <a className={`tab ${activeTab === 'CUSTOMER_INVOICE' ? 'tab-active' : ''}`} onClick={() => setActiveTab('CUSTOMER_INVOICE')}>Invoices</a>
        <a className={`tab ${activeTab === 'PURCHASE_ORDER' ? 'tab-active' : ''}`} onClick={() => setActiveTab('PURCHASE_ORDER')}>Purchase Orders</a>
        <a className={`tab ${activeTab === 'VENDOR_BILL' ? 'tab-active' : ''}`} onClick={() => setActiveTab('VENDOR_BILL')}>Vendor Bills</a>
        <a className={`tab ${activeTab === 'EXPENSE' ? 'tab-active' : ''}`} onClick={() => setActiveTab('EXPENSE')}>Expenses</a>
      </div>

      {/* Documents Table */}
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Documents ({documents.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Number</th>
                  <th className="text-left py-3 px-2">Project</th>
                  <th className="text-left py-3 px-2">Party</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted">
                      No documents found. Create your first document to get started!
                    </td>
                  </tr>
                ) : (
                  documents.map(doc => (
                    <tr key={doc.id} className="border-b border-base-300 hover:bg-base-200">
                      <td className="py-3 px-2">
                        <span className="flex items-center gap-2">
                          <span>{getDocTypeIcon(doc.documentType)}</span>
                          <span className="text-sm">{doc.documentType.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold">{doc.documentNumber}</td>
                      <td className="py-3 px-2 text-sm">{doc.projectName || '-'}</td>
                      <td className="py-3 px-2 text-sm">
                        {doc.customerName || doc.vendorName || doc.employeeUsername || '-'}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold">
                        ₹{doc.amount.toLocaleString()}
                        {doc.paidAmount && doc.paidAmount > 0 && (
                          <div className="text-xs text-success">Paid: ₹{doc.paidAmount.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`badge badge-sm ${getStatusBadge(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm">{new Date(doc.documentDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Create {modalType.replace('_', ' ')}</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Project *</span></label>
                  <select
                    className="select select-bordered"
                    value={formData.projectId}
                    onChange={(e) => {
                      const project = projects.find(p => p.id === parseInt(e.target.value));
                      setFormData({...formData, projectId: e.target.value, projectName: project?.name || ''});
                    }}
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                {['SALES_ORDER', 'CUSTOMER_INVOICE'].includes(modalType) && (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Customer Name *</span></label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      className="input input-bordered"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    />
                  </div>
                )}

                {['PURCHASE_ORDER', 'VENDOR_BILL'].includes(modalType) && (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Vendor Name *</span></label>
                    <input
                      type="text"
                      placeholder="Enter vendor name"
                      className="input input-bordered"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                    />
                  </div>
                )}

                {modalType === 'EXPENSE' && (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Employee Username *</span></label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="input input-bordered"
                      value={formData.employeeUsername}
                      onChange={(e) => setFormData({...formData, employeeUsername: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Amount (₹) *</span></label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="input input-bordered"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Document Date *</span></label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={formData.documentDate}
                    onChange={(e) => setFormData({...formData, documentDate: e.target.value})}
                  />
                </div>
              </div>

              {['CUSTOMER_INVOICE', 'VENDOR_BILL'].includes(modalType) && (
                <div className="form-control">
                  <label className="label"><span className="label-text">Due Date</span></label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              )}

              {modalType === 'CUSTOMER_INVOICE' && (
                <div className="form-control">
                  <label className="label"><span className="label-text">Milestone Name</span></label>
                  <input
                    type="text"
                    placeholder="e.g., Design Phase"
                    className="input input-bordered"
                    value={formData.milestoneName}
                    onChange={(e) => setFormData({...formData, milestoneName: e.target.value})}
                  />
                </div>
              )}

              {modalType === 'EXPENSE' && (
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Is this billable to customer?</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.isBillable}
                      onChange={(e) => setFormData({...formData, isBillable: e.target.checked})}
                    />
                  </label>
                </div>
              )}

              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea
                  placeholder="Enter description"
                  className="textarea textarea-bordered h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!formData.projectId || !formData.amount}
              >
                Create Document
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
        </div>
      )}
    </div>
  );
}
