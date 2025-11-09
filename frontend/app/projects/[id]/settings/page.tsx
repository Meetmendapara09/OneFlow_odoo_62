"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  FileText, 
  Package, 
  Receipt, 
  DollarSign, 
  Clock,
  Plus,
  ExternalLink
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: string;
  progress: number;
}

interface LinkedDocument {
  id: number;
  number?: string;
  partner?: string;
  customer?: string;
  vendor?: string;
  totalAmount: number;
  status: string;
  date?: string;
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const { hasAnyRole } = useAuth();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Linked documents
  const [salesOrders, setSalesOrders] = useState<LinkedDocument[]>([]);
  const [invoices, setInvoices] = useState<LinkedDocument[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<LinkedDocument[]>([]);
  const [vendorBills, setVendorBills] = useState<LinkedDocument[]>([]);
  const [expenses, setExpenses] = useState<LinkedDocument[]>([]);
  const [timesheets, setTimesheets] = useState<LinkedDocument[]>([]);

  const [activeTab, setActiveTab] = useState<'revenue' | 'costs' | 'time'>('revenue');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectRes = await fetch(`http://localhost:8080/api/projects/${projectId}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject({
            id: projectData.id?.toString() || projectId,
            name: projectData.name,
            description: projectData.description,
            manager: projectData.manager,
            status: projectData.status,
            progress: projectData.progress
          });
        }

        // Fetch linked documents
        const [soRes, invRes, poRes, billRes, expRes, tsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/sales-orders?projectId=${projectId}`),
          fetch(`http://localhost:8080/api/invoices?projectId=${projectId}`),
          fetch(`http://localhost:8080/api/purchase-orders?projectId=${projectId}`),
          fetch(`http://localhost:8080/api/vendor-bills?projectId=${projectId}`),
          fetch(`http://localhost:8080/api/expenses?projectId=${projectId}`),
          fetch(`http://localhost:8080/api/timesheets?projectId=${projectId}`)
        ]);

        if (soRes.ok) {
          const data = await soRes.json();
          setSalesOrders(data.filter((so: any) => so.projectId === parseInt(projectId)));
        }
        if (invRes.ok) {
          const data = await invRes.json();
          setInvoices(data.filter((inv: any) => inv.projectId === parseInt(projectId)));
        }
        if (poRes.ok) {
          const data = await poRes.json();
          setPurchaseOrders(data.filter((po: any) => po.projectId === parseInt(projectId)));
        }
        if (billRes.ok) {
          const data = await billRes.json();
          setVendorBills(data.filter((bill: any) => bill.projectId === parseInt(projectId)));
        }
        if (expRes.ok) {
          const data = await expRes.json();
          setExpenses(data.filter((exp: any) => exp.projectId === parseInt(projectId)));
        }
        if (tsRes.ok) {
          const data = await tsRes.json();
          setTimesheets(data.filter((ts: any) => ts.projectId === parseInt(projectId)));
        }
      } catch (error) {
        console.error('Error fetching project settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <span className="loading loading-spinner loading-lg text-[#2563EB]"></span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen">
        <div className="alert alert-error">
          <span>Project not found</span>
          <Link href="/projects" className="btn btn-sm">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const totalRevenue = [...salesOrders, ...invoices].reduce((sum, doc) => sum + doc.totalAmount, 0);
  const totalCosts = [...purchaseOrders, ...vendorBills, ...expenses].reduce((sum, doc) => sum + doc.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/projects/${projectId}`} className="btn btn-ghost btn-sm gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{project.name}</h1>
            <p className="text-[#64748B]">Project Settings & Financial Documents</p>
          </div>
          <div className="flex gap-2">
            <span className={`badge ${
              project.status === 'In Progress' ? 'badge-primary' :
              project.status === 'Completed' ? 'badge-success' :
              project.status === 'On Hold' ? 'badge-warning' : 'badge-ghost'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="card-body">
            <h3 className="text-sm font-semibold text-green-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-green-600">{salesOrders.length} SOs · {invoices.length} Invoices</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
          <div className="card-body">
            <h3 className="text-sm font-semibold text-red-700">Total Costs</h3>
            <p className="text-3xl font-bold text-red-900">${totalCosts.toFixed(2)}</p>
            <p className="text-xs text-red-600">{purchaseOrders.length} POs · {vendorBills.length} Bills · {expenses.length} Expenses</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="card-body">
            <h3 className="text-sm font-semibold text-blue-700">Net Profit</h3>
            <p className={`text-3xl font-bold ${totalRevenue - totalCosts >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              ${(totalRevenue - totalCosts).toFixed(2)}
            </p>
            <p className="text-xs text-blue-600">
              {totalRevenue > 0 ? `${(((totalRevenue - totalCosts) / totalRevenue) * 100).toFixed(1)}% margin` : 'No revenue yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-white border border-[#E2E8F0] mb-6">
        <button 
          className={`tab ${activeTab === 'revenue' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          💰 Revenue
        </button>
        <button 
          className={`tab ${activeTab === 'costs' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('costs')}
        >
          💸 Costs
        </button>
        <button 
          className={`tab ${activeTab === 'time' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('time')}
        >
          ⏱️ Time
        </button>
      </div>

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Sales Orders */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Sales Orders
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/sales-orders?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  {hasAnyRole(['SALES_FINANCE', 'PROJECT_MANAGER', 'SUPERADMIN']) && (
                    <Link 
                      href={`/sales-orders/new?projectId=${projectId}`} 
                      className="btn btn-primary btn-sm gap-2"
                      title="Create Sales Order (Sales/Finance only)"
                    >
                      <Plus className="w-4 h-4" />
                      Create Sales Order
                    </Link>
                  )}
                </div>
              </div>
              
              {salesOrders.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No sales orders linked to this project yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>SO Number</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesOrders.map((so) => (
                        <tr key={so.id}>
                          <td className="font-mono">{so.number || `SO-${so.id}`}</td>
                          <td>{so.customer || so.partner}</td>
                          <td className="font-semibold">${so.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              so.status === 'Confirmed' ? 'badge-success' :
                              so.status === 'Draft' ? 'badge-ghost' : 'badge-warning'
                            }`}>
                              {so.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/sales-orders/${so.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Customer Invoices */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Customer Invoices
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/invoices?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  {hasAnyRole(['SALES_FINANCE', 'PROJECT_MANAGER', 'SUPERADMIN']) && (
                    <Link 
                      href={`/invoices/new?projectId=${projectId}`} 
                      className="btn btn-primary btn-sm gap-2"
                      title="Create Invoice (Sales/Finance only)"
                    >
                      <Plus className="w-4 h-4" />
                      Create Invoice
                    </Link>
                  )}
                </div>
              </div>
              
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No invoices linked to this project yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Invoice Number</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="font-mono">{inv.number || `INV-${inv.id}`}</td>
                          <td>{inv.customer || inv.partner}</td>
                          <td className="font-semibold text-green-600">${inv.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              inv.status === 'Paid' ? 'badge-success' :
                              inv.status === 'Sent' ? 'badge-info' : 'badge-ghost'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/invoices/${inv.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Purchase Orders */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Purchase Orders
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/purchase-orders?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  {hasAnyRole(['SALES_FINANCE', 'PROJECT_MANAGER', 'SUPERADMIN']) && (
                    <Link 
                      href={`/purchase-orders/new?projectId=${projectId}`} 
                      className="btn btn-primary btn-sm gap-2"
                      title="Create Purchase Order (Sales/Finance only)"
                    >
                      <Plus className="w-4 h-4" />
                      Create PO
                    </Link>
                  )}
                </div>
              </div>
              
              {purchaseOrders.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No purchase orders linked to this project yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>PO Number</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.map((po) => (
                        <tr key={po.id}>
                          <td className="font-mono">{po.number || `PO-${po.id}`}</td>
                          <td>{po.vendor || po.partner}</td>
                          <td className="font-semibold text-red-600">${po.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              po.status === 'Confirmed' ? 'badge-success' :
                              po.status === 'Draft' ? 'badge-ghost' : 'badge-warning'
                            }`}>
                              {po.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/purchase-orders/${po.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Bills */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-red-600" />
                  Vendor Bills
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/vendor-bills?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  {hasAnyRole(['SALES_FINANCE', 'PROJECT_MANAGER', 'SUPERADMIN']) && (
                    <Link 
                      href={`/vendor-bills/new?projectId=${projectId}`} 
                      className="btn btn-primary btn-sm gap-2"
                      title="Create Vendor Bill (Sales/Finance only)"
                    >
                      <Plus className="w-4 h-4" />
                      Create Bill
                    </Link>
                  )}
                </div>
              </div>
              
              {vendorBills.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <Receipt className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No vendor bills linked to this project yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Bill Number</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorBills.map((bill) => (
                        <tr key={bill.id}>
                          <td className="font-mono">{bill.number || `BILL-${bill.id}`}</td>
                          <td>{bill.vendor || bill.partner}</td>
                          <td className="font-semibold text-red-600">${bill.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              bill.status === 'Paid' ? 'badge-success' :
                              bill.status === 'Posted' ? 'badge-info' : 'badge-ghost'
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/vendor-bills/${bill.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Expenses */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  Expenses
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/expenses?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  {/* All users can create expenses, but approval is restricted */}
                  <Link 
                    href={`/expenses/new?projectId=${projectId}`} 
                    className="btn btn-primary btn-sm gap-2"
                    title="Create Expense (All users)"
                  >
                    <Plus className="w-4 h-4" />
                    Create Expense
                  </Link>
                </div>
              </div>
              
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No expenses linked to this project yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp: any) => (
                        <tr key={exp.id}>
                          <td>{exp.description || exp.category}</td>
                          <td className="font-semibold text-orange-600">${exp.totalAmount?.toFixed(2) || exp.amount?.toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              exp.status === 'Approved' ? 'badge-success' :
                              exp.status === 'Submitted' ? 'badge-info' :
                              exp.status === 'Rejected' ? 'badge-error' : 'badge-ghost'
                            }`}>
                              {exp.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/expenses/${exp.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Time Tab */}
      {activeTab === 'time' && (
        <div className="space-y-6">
          {/* Timesheets */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Timesheets
                </h2>
                <div className="flex gap-2">
                  <Link 
                    href={`/timesheets?project=${projectId}`} 
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Link>
                  <Link 
                    href={`/timesheets/new?projectId=${projectId}`} 
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Log Time
                  </Link>
                </div>
              </div>
              
              {timesheets.length === 0 ? (
                <div className="text-center py-8 text-[#64748B]">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No time entries logged for this project yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-semibold">Total Hours</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {timesheets.reduce((sum: number, ts: any) => sum + (ts.hours || 0), 0).toFixed(1)}h
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-semibold">Billable Hours</p>
                      <p className="text-2xl font-bold text-green-900">
                        {timesheets.filter((ts: any) => ts.billable).reduce((sum: number, ts: any) => sum + (ts.hours || 0), 0).toFixed(1)}h
                      </p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-sm text-indigo-700 font-semibold">Total Cost</p>
                      <p className="text-2xl font-bold text-indigo-900">
                        ${timesheets.reduce((sum: number, ts: any) => sum + (ts.cost || 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>Hours</th>
                          <th>Billable</th>
                          <th>Cost</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timesheets.slice(0, 10).map((ts: any) => (
                          <tr key={ts.id}>
                            <td>{ts.date}</td>
                            <td>User #{ts.userId}</td>
                            <td className="font-semibold">{ts.hours}h</td>
                            <td>
                              {ts.billable ? (
                                <span className="badge badge-success badge-sm">Billable</span>
                              ) : (
                                <span className="badge badge-ghost badge-sm">Non-billable</span>
                              )}
                            </td>
                            <td className="font-semibold">${ts.cost?.toFixed(2) || '0.00'}</td>
                            <td>
                              <Link href={`/timesheets/${ts.id}`} className="btn btn-ghost btn-xs">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {timesheets.length > 10 && (
                    <div className="text-center">
                      <Link href={`/timesheets?project=${projectId}`} className="btn btn-sm btn-ghost">
                        View all {timesheets.length} timesheets
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
