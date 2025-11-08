"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Receipt, Check, X, Clock } from "lucide-react";

interface Expense {
  id: number;
  expenseNumber: string;
  userId: number;
  projectId?: number;
  taskId?: number;
  expenseDate: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  receiptPath?: string;
  status: string;
  billable: boolean;
  submittedDate?: string;
  approvedDate?: string;
  approvedBy?: number;
  rejectionReason?: string;
}

const CATEGORIES = ["Travel", "Food", "Supplies", "Software", "Other"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [formData, setFormData] = useState({
    projectId: "",
    taskId: "",
    expenseDate: new Date().toISOString().split("T")[0],
    amount: "",
    category: "Travel",
    description: "",
    billable: false,
  });

  const fetchExpenses = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData: Expense[] = [
        {
          id: 1,
          expenseNumber: "EXP-001",
          userId: 1,
          projectId: 1,
          expenseDate: "2025-11-05",
          amount: 1500,
          currency: "USD",
          category: "Travel",
          description: "Client meeting travel",
          status: "Approved",
          billable: true,
          submittedDate: "2025-11-05T10:00:00",
          approvedDate: "2025-11-06T14:30:00",
        },
        {
          id: 2,
          expenseNumber: "EXP-002",
          userId: 1,
          projectId: 1,
          expenseDate: "2025-11-07",
          amount: 450,
          currency: "USD",
          category: "Software",
          description: "Design tool subscription",
          status: "Submitted",
          billable: false,
          submittedDate: "2025-11-07T16:00:00",
        },
      ];
      setExpenses(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Creating/updating expense:", formData);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      projectId: expense.projectId?.toString() || "",
      taskId: expense.taskId?.toString() || "",
      expenseDate: expense.expenseDate,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      billable: expense.billable,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      // TODO: Implement API call
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  const handleStatusChange = async (id: number, action: string) => {
    // TODO: Implement API call for submit/approve/reject
    console.log(`${action} expense ${id}`);
  };

  const resetForm = () => {
    setFormData({
      projectId: "",
      taskId: "",
      expenseDate: new Date().toISOString().split("T")[0],
      amount: "",
      category: "Travel",
      description: "",
      billable: false,
    });
    setEditingExpense(null);
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      Draft: "bg-slate-100 text-slate-700 border-slate-200",
      Submitted: "bg-blue-100 text-blue-700 border-blue-200",
      Approved: "bg-green-100 text-green-700 border-green-200",
      Rejected: "bg-red-100 text-red-700 border-red-200",
      Reimbursed: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${classes[status] || classes.Draft}`;
  };

  const filtered = filterStatus === "All" 
    ? expenses 
    : expenses.filter(e => e.status === filterStatus);

  const totalExpenses = filtered.reduce((sum, e) => sum + e.amount, 0);
  const billableExpenses = filtered.filter(e => e.billable).reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === "Submitted").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <span className="loading loading-spinner loading-lg text-[#2563EB]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/expenses/pending" className="btn btn-outline btn-sm">
            <Clock className="w-4 h-4" />
            Pending Approvals ({pendingCount})
          </Link>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Submit Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Total Expenses</h3>
            <p className="text-3xl font-bold mt-1 text-[#1E293B]">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Billable</h3>
            <p className="text-3xl font-bold mt-1 text-[#16A34A]">${billableExpenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Pending Approval</h3>
            <p className="text-3xl font-bold mt-1 text-[#F59E0B]">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "Draft", "Submitted", "Approved", "Rejected", "Reimbursed"].map(status => (
          <button
            key={status}
            className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterStatus(status)}
          >{status}</button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="card bg-white border border-[#E2E8F0] shadow-sm">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Expense #</th>
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Category</th>
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Description</th>
                  <th className="text-right py-3 px-2 font-medium text-[#64748B]">Amount</th>
                  <th className="text-center py-3 px-2 font-medium text-[#64748B]">Billable</th>
                  <th className="text-center py-3 px-2 font-medium text-[#64748B]">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense) => (
                  <tr key={expense.id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9]">
                    <td className="py-3 px-2 font-medium text-[#2563EB]">
                      <Link href={`/expenses/${expense.id}`}>{expense.expenseNumber}</Link>
                    </td>
                    <td className="py-3 px-2 text-[#1E293B]">
                      {new Date(expense.expenseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-2 text-[#1E293B]">{expense.category}</td>
                    <td className="py-3 px-2 text-[#64748B]">{expense.description}</td>
                    <td className="py-3 px-2 text-right font-medium text-[#1E293B]">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {expense.billable ? (
                        <Check className="w-4 h-4 text-[#16A34A] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-[#64748B] mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={getStatusBadge(expense.status)}>{expense.status}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        {expense.status === "Draft" && (
                          <>
                            <button
                              onClick={() => handleEdit(expense)}
                              className="btn btn-ghost btn-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleStatusChange(expense.id, "submit")}
                              className="btn btn-ghost btn-xs text-[#2563EB]"
                            >
                              Submit
                            </button>
                          </>
                        )}
                        {expense.status === "Submitted" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(expense.id, "approve")}
                              className="btn btn-ghost btn-xs text-[#16A34A]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(expense.id, "reject")}
                              className="btn btn-ghost btn-xs text-[#DC2626]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {expense.status === "Draft" && (
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E2E8F0] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
                  {editingExpense ? "Edit Expense" : "Submit Expense"}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Project ID</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Task ID</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.taskId}
                      onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Expense Date *</label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={formData.expenseDate}
                      onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input input-bordered"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label text-sm font-medium text-[#1E293B]">Category *</label>
                    <select
                      className="select select-bordered"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-sm font-medium text-[#1E293B]">Description *</label>
                  <textarea
                    className="textarea textarea-bordered min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the expense..."
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formData.billable}
                      onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    />
                    <span className="label-text font-medium text-[#1E293B]">
                      Billable to customer
                    </span>
                  </label>
                </div>

                <div className="alert bg-[#EFF6FF] border border-[#2563EB]/20">
                  <Receipt className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm text-[#1E293B]">
                    Remember to attach your receipt after creating the expense.
                  </span>
                </div>

                <div className="card-actions justify-end mt-6 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingExpense ? "Update" : "Create"} Expense
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
