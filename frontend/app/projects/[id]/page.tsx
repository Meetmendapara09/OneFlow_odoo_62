"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";

const PROJECTS = [
  { id: "p1", name: "Student Portal Revamp", description: "UI modernization and performance work for the student portal. This includes updating the design system, improving load times, and implementing new features requested by students.", manager: "A. Patel", status: "In Progress" as const, progress: 65, deadline: "2025-12-01", teamSize: 5, tasksCompleted: 13, totalTasks: 20, budget: 125000, spent: 78000 },
  { id: "p2", name: "HRMS Integration", description: "Sync HR data with core systems including payroll, attendance, and performance management.", manager: "R. Singh", status: "Planned" as const, progress: 15, deadline: "2026-01-15", teamSize: 3, tasksCompleted: 2, totalTasks: 15, budget: 85000, spent: 12000 },
  { id: "p3", name: "Finance Workflows", description: "Streamline approvals and reporting for finance department operations.", manager: "S. Kumar", status: "On Hold" as const, progress: 35, deadline: "2026-03-01", teamSize: 4, tasksCompleted: 7, totalTasks: 18, budget: 95000, spent: 33000 },
  { id: "p4", name: "AI Pilot", description: "Internal experimentation with ML models for predictive analytics and automation.", manager: "N. Shah", status: "Completed" as const, progress: 100, deadline: "2025-10-01", teamSize: 6, tasksCompleted: 25, totalTasks: 25, budget: 150000, spent: 148000 },
  { id: "p5", name: "Campus IoT Network", description: "Deploy IoT sensors across campus for smart building management and energy optimization.", manager: "V. Mehta", status: "In Progress" as const, progress: 68, deadline: "2025-11-30", teamSize: 8, tasksCompleted: 17, totalTasks: 25, budget: 200000, spent: 136000 },
  { id: "p6", name: "Library Management System", description: "Modernize library cataloging and borrowing system with RFID integration.", manager: "K. Desai", status: "Planned" as const, progress: 5, deadline: "2026-02-01", teamSize: 4, tasksCompleted: 1, totalTasks: 22, budget: 110000, spent: 5500 },
];

const PROJECT_TASKS = {
  p1: [
    { id: "t1", title: "Design Wireframes", assignee: "Jane", due: "2025-11-20", priority: "High" as const, state: "In Progress" as const },
    { id: "t5", title: "Database Schema Design", assignee: "Jane", due: "2025-11-25", priority: "High" as const, state: "In Progress" as const },
    { id: "t7", title: "Frontend Components", assignee: "Raj", due: "2025-11-28", priority: "Medium" as const, state: "New" as const },
  ],
  p2: [
    { id: "t2", title: "HR API Mapping", assignee: "Raj", due: "2025-12-01", priority: "Medium" as const, state: "New" as const },
  ],
  p3: [
    { id: "t3", title: "Approval Flow Implementation", assignee: "Sara", due: "2025-11-15", priority: "High" as const, state: "Blocked" as const },
  ],
  p4: [
    { id: "t4", title: "Deploy to Production", assignee: "Neil", due: "2025-09-20", priority: "Low" as const, state: "Done" as const },
  ],
  p5: [
    { id: "t6", title: "IoT Sensor Configuration", assignee: "Raj", due: "2025-11-18", priority: "Medium" as const, state: "In Progress" as const },
  ],
  p6: [],
};

const TEAM_MEMBERS = {
  p1: ["Jane", "Raj", "Sara", "Neil", "V. Mehta"],
  p2: ["Raj", "Sara", "K. Desai"],
  p3: ["Sara", "Neil", "A. Patel", "S. Kumar"],
  p4: ["Neil", "Jane", "Raj", "V. Mehta", "K. Desai", "A. Patel"],
  p5: ["V. Mehta", "Raj", "Sara", "Jane", "Neil", "K. Desai", "A. Patel", "S. Kumar"],
  p6: ["K. Desai", "Jane", "Raj", "Sara"],
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [financials, setFinancials] = useState<any>(null);
  const [docCounts, setDocCounts] = useState<any>(null);
  const [loadingFinancials, setLoadingFinancials] = useState(true);

  const project = useMemo(() => {
    return PROJECTS.find(p => p.id === projectId);
  }, [projectId]);

  const tasks = useMemo(() => {
    return PROJECT_TASKS[projectId as keyof typeof PROJECT_TASKS] || [];
  }, [projectId]);

  const team = useMemo(() => {
    return TEAM_MEMBERS[projectId as keyof typeof TEAM_MEMBERS] || [];
  }, [projectId]);

  // Modal states
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showManageTeamModal, setShowManageTeamModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  // Task form state
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "Medium",
    description: ""
  });

  // Team management state
  const [newMember, setNewMember] = useState("");

  // Handlers
  const handleAddTask = () => {
    console.log("Adding task:", newTask);
    // TODO: Integrate with API
    alert(`Task "${newTask.title}" added successfully!`);
    setShowAddTaskModal(false);
    setNewTask({ title: "", assignee: "", dueDate: "", priority: "Medium", description: "" });
  };

  const handleAddTeamMember = () => {
    if (newMember.trim()) {
      console.log("Adding team member:", newMember);
      // TODO: Integrate with API
      alert(`${newMember} added to the team!`);
      setNewMember("");
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    if (confirm(`Remove ${member} from the team?`)) {
      console.log("Removing team member:", member);
      // TODO: Integrate with API
      alert(`${member} removed from the team!`);
    }
  };

  if (!project) {
    return (
      <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
        <div className="alert bg-[#FEF2F2] border border-[#EF4444]/30 text-[#7F1D1D]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Project not found</span>
        </div>
        <Link href="/projects" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const statusBadgeClasses: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-700 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Planned': 'bg-slate-100 text-slate-700 border-slate-200',
    'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
    'Blocked': 'bg-red-100 text-red-700 border-red-200',
    'New': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  const priorityBadgeClasses: Record<string, string> = {
    'High': 'bg-red-100 text-red-700 border-red-200',
    'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
    'Low': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const budgetUsed = project.spent && project.budget ? (project.spent / project.budget) * 100 : 0;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0 && project.status !== "Completed";

  return (
    <div className="space-y-8 bg-[#F8FAFC] p-2 md:p-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
  <h1 className="text-3xl font-bold flex-1 text-[#1E293B]">{project.name}</h1>
  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadgeClasses[project.status]}`}>{project.status}</span>
      </div>

      {/* Project Overview Card */}
      <div className="card bg-white border border-[#E2E8F0] shadow-sm">
        <div className="card-body">
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Project Overview</h2>
          <p className="text-sm leading-relaxed text-[#64748B]">{project.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Project Manager:</span>
                <span className="font-semibold text-[#1E293B]">{project.manager}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Team Size:</span>
                <span className="font-semibold text-[#1E293B]">{project.teamSize} members</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Deadline:</span>
                <span className={`font-semibold ${isOverdue ? "text-error" : "text-[#1E293B]"}`}>
                  {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {isOverdue && <span className="ml-2 text-error text-xs">(Overdue)</span>}
                  {!isOverdue && daysLeft >= 0 && <span className="ml-2 text-muted text-xs">({daysLeft} days left)</span>}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Tasks:</span>
                <span className="font-semibold text-[#1E293B]">{project.tasksCompleted}/{project.totalTasks} completed</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Budget:</span>
                <span className="font-semibold text-[#1E293B]">${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Spent:</span>
                <span className="font-semibold text-[#DC2626]">${project.spent?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs uppercase tracking-wide font-semibold text-[#64748B]">Overall Progress</h3>
            <p className="text-3xl font-bold text-[#2563EB] mt-1">{project.progress}%</p>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden mt-3">
              <div className="h-full bg-[#2563EB]" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs uppercase tracking-wide font-semibold text-[#64748B]">Budget Used</h3>
            <p className="text-3xl font-bold text-[#F59E0B] mt-1">{budgetUsed.toFixed(0)}%</p>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden mt-3">
              <div className="h-full bg-[#F59E0B]" style={{ width: `${budgetUsed}%` }} />
            </div>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs uppercase tracking-wide font-semibold text-[#64748B]">Task Completion</h3>
            <p className="text-3xl font-bold text-[#16A34A] mt-1">{project.totalTasks > 0 ? Math.round((project.tasksCompleted / project.totalTasks) * 100) : 0}%</p>
            <p className="text-xs text-[#64748B] mt-2">{project.tasksCompleted} of {project.totalTasks} tasks done</p>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      {!loadingFinancials && financials && (
        <div className="space-y-6">
          {/* Financial Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-green-700">Revenue</h3>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      ${financials.revenue.invoiced.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ${financials.revenue.paid.toFixed(2)} paid
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 opacity-70" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-red-700">Total Costs</h3>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      ${financials.costs.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Bills + Expenses + Time
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600 opacity-70" />
                </div>
              </div>
            </div>

            <div className={`card bg-gradient-to-br ${
              financials.profit.amount >= 0 
                ? 'from-blue-50 to-blue-100 border-blue-200' 
                : 'from-orange-50 to-orange-100 border-orange-200'
            } shadow-sm border`}>
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xs uppercase tracking-wide font-semibold ${
                      financials.profit.amount >= 0 ? 'text-blue-700' : 'text-orange-700'
                    }`}>Profit</h3>
                    <p className={`text-2xl font-bold mt-1 ${
                      financials.profit.amount >= 0 ? 'text-blue-900' : 'text-orange-900'
                    }`}>
                      ${financials.profit.amount.toFixed(2)}
                    </p>
                    <p className={`text-xs mt-1 ${
                      financials.profit.amount >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {financials.profit.margin.toFixed(2)}% margin
                    </p>
                  </div>
                  <DollarSign className={`w-8 h-8 opacity-70 ${
                    financials.profit.amount >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-amber-700">Outstanding</h3>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      ${financials.revenue.outstanding.toFixed(2)}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      To be collected
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-amber-600 opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Financial Breakdown */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Financial Breakdown</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Details */}
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3">Revenue Streams</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Customer Invoices</span>
                      <span className="font-semibold text-green-700">${financials.revenue.invoiced.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Paid Amount</span>
                      <span className="font-semibold text-green-600">${financials.revenue.paid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Outstanding</span>
                      <span className="font-semibold text-amber-600">${financials.revenue.outstanding.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-[#64748B]">Sales Orders (Pipeline)</span>
                      <span className="font-semibold text-[#1E293B]">${financials.revenue.salesOrders.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Details */}
                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-3">Cost Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Vendor Bills</span>
                      <span className="font-semibold text-red-700">${financials.costs.bills.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Expenses</span>
                      <span className="font-semibold text-red-600">${financials.costs.expenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748B]">Timesheet Costs</span>
                      <span className="font-semibold text-red-600">${financials.costs.timesheets.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-[#64748B] font-semibold">Total Costs</span>
                      <span className="font-bold text-red-800">${financials.costs.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Summary */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-[#1E293B] mb-3">Time Tracking</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#64748B]">Total Hours</p>
                    <p className="text-xl font-bold text-[#1E293B]">{financials.hours.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Billable Hours</p>
                    <p className="text-xl font-bold text-green-700">{financials.hours.billable.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Non-Billable</p>
                    <p className="text-xl font-bold text-orange-600">{financials.hours.nonBillable.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Documents Section */}
          {docCounts && (
            <div className="card bg-white border border-[#E2E8F0] shadow-sm">
              <div className="card-body">
                <h2 className="text-xl font-bold text-[#1E293B] mb-4">Linked Financial Documents</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Link href={`/sales-orders?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.salesOrders}</p>
                    <p className="text-xs text-[#64748B]">Sales Orders</p>
                  </Link>

                  <Link href={`/invoices?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <FileText className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.invoices}</p>
                    <p className="text-xs text-[#64748B]">Invoices</p>
                  </Link>

                  <Link href={`/purchase-orders?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <Package className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.purchaseOrders}</p>
                    <p className="text-xs text-[#64748B]">Purchase Orders</p>
                  </Link>

                  <Link href={`/vendor-bills?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <Receipt className="w-8 h-8 text-red-600 mb-2" />
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.vendorBills}</p>
                    <p className="text-xs text-[#64748B]">Vendor Bills</p>
                  </Link>

                  <Link href={`/expenses?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.expenses}</p>
                    <p className="text-xs text-[#64748B]">Expenses</p>
                  </Link>

                  <Link href={`/timesheets?project=${projectId}`} 
                        className="flex flex-col items-center p-4 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-2xl font-bold text-[#1E293B]">{docCounts.timesheets}</p>
                    <p className="text-xs text-[#64748B]">Timesheets</p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1E293B]">Project Tasks</h2>
                <Link href="/tasks" className="btn btn-primary btn-sm">
                  View All Tasks
                </Link>
              </div>
              
              {tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <th className="text-left py-3 px-2 font-medium text-[#64748B]">Task</th>
                        <th className="text-left py-3 px-2 font-medium text-[#64748B]">Assignee</th>
                        <th className="text-left py-3 px-2 font-medium text-[#64748B]">Due Date</th>
                        <th className="text-left py-3 px-2 font-medium text-[#64748B]">Priority</th>
                        <th className="text-left py-3 px-2 font-medium text-[#64748B]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr key={task.id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9]">
                          <td className="py-3 px-2 font-medium text-[#1E293B]">{task.title}</td>
                          <td className="py-3 px-2 text-[#1E293B]">{task.assignee}</td>
                          <td className="py-3 px-2 text-xs text-[#64748B]">
                            {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityBadgeClasses[task.priority]}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadgeClasses[task.state]}`}>
                              {task.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert bg-[#EFF6FF] border border-[#2563EB]/20 text-[#1E293B]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No tasks assigned to this project yet.</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Project Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                    <div className="w-0.5 h-full bg-[#16A34A]"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-[#1E293B]">Project Created</p>
                    <p className="text-xs text-[#64748B]">Initial planning and setup</p>
                  </div>
                </div>
                
                {project.progress > 0 && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                      <div className="w-0.5 h-full bg-[#E2E8F0]"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-[#1E293B]">Development Started</p>
                      <p className="text-xs text-[#64748B]">Team began implementation</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${project.status === "Completed" ? "bg-[#16A34A]" : "bg-[#E2E8F0]"}`}></div>
                  </div>
                  <div>
                    <p className={`font-semibold ${project.status === "Completed" ? "text-[#1E293B]" : "text-[#64748B]"}`}>
                      Project Completion
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {project.status === "Completed" ? "Successfully completed" : `Target: ${new Date(project.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Team Members</h2>
              <div className="space-y-3">
                {team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold">
                      {member[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#1E293B]">{member}</p>
                      <p className="text-xs text-[#64748B]">
                        {index === 0 ? "Project Manager" : "Team Member"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Task Title *</span></label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="input input-bordered w-full"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea
                  placeholder="Enter task description"
                  className="textarea textarea-bordered h-24"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Assignee *</span></label>
                  <select
                    className="select select-bordered w-full"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  >
                    <option value="">Select assignee</option>
                    {team.map((member, index) => (
                      <option key={index} value={member}>{member}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Priority</span></label>
                  <select
                    className="select select-bordered w-full"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Due Date *</span></label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowAddTaskModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.assignee || !newTask.dueDate}
              >
                Add Task
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAddTaskModal(false)}></div>
        </div>
      )}

      {/* Manage Team Modal */}
      {showManageTeamModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-4">Manage Team Members</h3>

            {/* Current Team */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Current Team ({team.length} members)</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                        {member[0]}
                      </div>
                      <div>
                        <p className="font-medium">{member}</p>
                        <p className="text-xs text-muted">
                          {index === 0 ? "Project Manager" : "Team Member"}
                        </p>
                      </div>
                    </div>
                    {index !== 0 && (
                      <button
                        className="btn btn-ghost btn-sm btn-error"
                        onClick={() => handleRemoveTeamMember(member)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Member */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Add New Member</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter username or email"
                  className="input input-bordered flex-1"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddTeamMember}
                  disabled={!newMember.trim()}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowManageTeamModal(false)}>Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowManageTeamModal(false)}></div>
        </div>
      )}

      {/* View Reports Modal */}
      {showReportsModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Project Reports - {project.name}</h3>

            <div className="tabs tabs-boxed mb-4">
              <a className="tab tab-active">Financial</a>
              <a className="tab">Progress</a>
              <a className="tab">Team Performance</a>
            </div>

            {/* Financial Report */}
            <div className="space-y-4">
              <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Total Budget</div>
                  <div className="stat-value text-primary">${project.budget?.toLocaleString()}</div>
                  <div className="stat-desc">Allocated funds</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Amount Spent</div>
                  <div className="stat-value metric-cost">${project.spent?.toLocaleString()}</div>
                  <div className="stat-desc">{budgetUsed.toFixed(0)}% of budget</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Remaining</div>
                  <div className="stat-value metric-profit">${(project.budget - project.spent).toLocaleString()}</div>
                  <div className="stat-desc">{(100 - budgetUsed).toFixed(0)}% available</div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="card-title text-sm">Progress Overview</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="progress progress-primary">
                        <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tasks Completed</span>
                        <span className="font-semibold">{project.tasksCompleted}/{project.totalTasks}</span>
                      </div>
                      <div className="progress progress-success">
                        <div className="progress-bar" style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Utilization</span>
                        <span className="font-semibold">{budgetUsed.toFixed(0)}%</span>
                      </div>
                      <div className="progress progress-warning">
                        <div className="progress-bar" style={{ width: `${budgetUsed}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h4 className="card-title text-sm">Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Start Date</span>
                        <span className="font-semibold">Nov 1, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Deadline</span>
                        <span className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Days Remaining</span>
                        <span className={`font-semibold ${isOverdue ? 'text-error' : ''}`}>
                          {isOverdue ? 'Overdue' : `${daysLeft} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h4 className="card-title text-sm">Team Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Team Size</span>
                        <span className="font-semibold">{project.teamSize} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Avg. Tasks/Member</span>
                        <span className="font-semibold">{(project.totalTasks / project.teamSize).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Completion Rate</span>
                        <span className="font-semibold">{((project.tasksCompleted / project.totalTasks) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-outline">Export PDF</button>
              <button className="btn" onClick={() => setShowReportsModal(false)}>Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowReportsModal(false)}></div>
        </div>
      )}
    </div>
  );
}
