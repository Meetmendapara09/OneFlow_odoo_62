"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
}

interface DocumentCounts {
  salesOrders: number;
  invoices: number;
  purchaseOrders: number;
  vendorBills: number;
  expenses: number;
  timesheets: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          projectsRes,
          tasksRes,
          timesheetsRes,
          expensesRes,
          invoicesRes,
          billsRes,
          salesOrdersRes,
          purchaseOrdersRes
        ] = await Promise.all([
          fetch('http://localhost:8080/api/projects'),
          fetch('http://localhost:8080/api/tasks'),
          fetch('http://localhost:8080/api/timesheets'),
          fetch('http://localhost:8080/api/expenses'),
          fetch('http://localhost:8080/api/invoices'),
          fetch('http://localhost:8080/api/vendor-bills'),
          fetch('http://localhost:8080/api/sales-orders'),
          fetch('http://localhost:8080/api/purchase-orders')
        ]);

        const [
          projectsData,
          tasksData,
          timesheetsData,
          expensesData,
          invoicesData,
          billsData,
          salesOrdersData,
          purchaseOrdersData
        ] = await Promise.all([
          projectsRes.ok ? projectsRes.json() : [],
          tasksRes.ok ? tasksRes.json() : [],
          timesheetsRes.ok ? timesheetsRes.json() : [],
          expensesRes.ok ? expensesRes.json() : [],
          invoicesRes.ok ? invoicesRes.json() : [],
          billsRes.ok ? billsRes.json() : [],
          salesOrdersRes.ok ? salesOrdersRes.json() : [],
          purchaseOrdersRes.ok ? purchaseOrdersRes.json() : []
        ]);

        setProjects(projectsData);
        setTasks(tasksData);
        setTimesheets(timesheetsData);
        setExpenses(expensesData);
        setInvoices(invoicesData);
        setBills(billsData);
        setSalesOrders(salesOrdersData);
        setPurchaseOrders(purchaseOrdersData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate KPIs
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalHours = timesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  // Financial Summary
  const totalRevenue = invoices
    .filter(inv => ['Sent', 'Paid'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const totalCosts = 
    bills.filter(b => ['Posted', 'Paid'].includes(b.status)).reduce((sum, b) => sum + b.totalAmount, 0) +
    expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0) +
    timesheets.reduce((sum, ts) => sum + (ts.cost || 0), 0);
  
  const totalProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Task Status Distribution
  const taskStatusData = [
    { name: "New", value: tasks.filter(t => t.status === 'New').length, color: "#E2E8F0" },
    { name: "In Progress", value: tasks.filter(t => t.status === 'In Progress').length, color: "#2563EB" },
    { name: "Blocked", value: tasks.filter(t => t.status === 'Blocked').length, color: "#EF4444" },
    { name: "Done", value: tasks.filter(t => t.status === 'Done').length, color: "#22C55E" },
  ];

  // Project Progress Data
  const projectProgressData = projects.map(p => ({
    name: p.name,
    progress: p.progress || 0,
    status: p.status
  })).slice(0, 6); // Top 6 projects

  // Financial Data by Status
  const financialOverview = [
    { 
      category: "Revenue", 
      invoiced: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paid: invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
    },
    { 
      category: "Costs",
      bills: bills.reduce((sum, b) => sum + b.totalAmount, 0),
      expenses: expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0)
    }
  ];

  // Document Counts
  const documentCounts: DocumentCounts = {
    salesOrders: salesOrders.length,
    invoices: invoices.length,
    purchaseOrders: purchaseOrders.length,
    vendorBills: bills.length,
    expenses: expenses.length,
    timesheets: timesheets.length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
      <div className="flex items-center justify-end">
        <select className="select select-bordered select-sm">
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[{
          label: 'Total Projects', value: totalProjects, color: '#2563EB', desc: 'Active projects'
        }, {
          label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}`, color: '#16A34A', 
          desc: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion` : 'No tasks'
        }, {
          label: 'Hours Logged', value: totalHours.toFixed(0), color: '#1E293B', desc: 'Total time tracked'
        }, {
          label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}k`, color: '#16A34A', desc: 'From invoices'
        }, {
          label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, color: profitMargin >= 0 ? '#6366F1' : '#EF4444', 
          desc: `$${(totalProfit / 1000).toFixed(0)}k profit`
        }].map((kpi, i) => (
          <div key={i} className="card bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body p-4">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">{kpi.label}</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-sm text-[#64748B]">{kpi.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Project Progress Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="progress" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Financial Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-700 font-semibold">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-green-600">{invoices.length} invoices</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm text-red-700 font-semibold">Total Costs</p>
                  <p className="text-2xl font-bold text-red-900">${totalCosts.toFixed(2)}</p>
                  <p className="text-xs text-red-600">Bills + Expenses + Time</p>
                </div>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-lg ${
                totalProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'
              }`}>
                <div>
                  <p className={`text-sm font-semibold ${totalProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    Net Profit
                  </p>
                  <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                    ${totalProfit.toFixed(2)}
                  </p>
                  <p className={`text-xs ${totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {profitMargin.toFixed(2)}% margin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Statistics */}
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Document Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-semibold">Sales Orders</p>
                <p className="text-2xl font-bold text-blue-900">{documentCounts.salesOrders}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-semibold">Invoices</p>
                <p className="text-2xl font-bold text-green-900">{documentCounts.invoices}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700 font-semibold">Purchase Orders</p>
                <p className="text-2xl font-bold text-purple-900">{documentCounts.purchaseOrders}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 font-semibold">Vendor Bills</p>
                <p className="text-2xl font-bold text-red-900">{documentCounts.vendorBills}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-700 font-semibold">Expenses</p>
                <p className="text-2xl font-bold text-orange-900">{documentCounts.expenses}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-700 font-semibold">Timesheets</p>
                <p className="text-2xl font-bold text-indigo-900">{documentCounts.timesheets}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense & Invoice Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Expense Status Breakdown</h2>
            <div className="space-y-2">
              {['Draft', 'Submitted', 'Approved', 'Rejected', 'Reimbursed'].map(status => {
                const count = expenses.filter(e => e.status === status).length;
                return (
                  <div key={status} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-[#64748B]">{status}</span>
                    <span className="font-semibold text-[#1E293B]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Invoice Payment Status</h2>
            <div className="space-y-2">
              {['Unpaid', 'Partial', 'Paid'].map(status => {
                const count = invoices.filter(inv => inv.paymentStatus === status).length;
                const amount = invoices
                  .filter(inv => inv.paymentStatus === status)
                  .reduce((sum, inv) => sum + inv.totalAmount, 0);
                return (
                  <div key={status} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <span className="text-sm text-[#64748B]">{status}</span>
                      <p className="text-xs text-[#94A3B8]">{count} invoices</p>
                    </div>
                    <span className="font-semibold text-[#1E293B]">${amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

