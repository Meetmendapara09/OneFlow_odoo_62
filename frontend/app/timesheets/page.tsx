"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Plus, Check, X, DollarSign } from "lucide-react";

interface Timesheet {
  id: number;
  userId: number;
  taskId: number;
  projectId: number;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  status: string;
  hourlyRate: number;
  cost?: number;
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null);
  const [formData, setFormData] = useState({
    taskId: "",
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    description: "",
    billable: true,
  });

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData: Timesheet[] = [
        {
          id: 1,
          userId: 1,
          taskId: 1,
          projectId: 1,
          date: "2025-11-08",
          hours: 8,
          description: "Design wireframes",
          billable: true,
          status: "Approved",
          hourlyRate: 50,
          cost: 400,
        },
      ];
      setTimesheets(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Creating/updating timesheet:", formData);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (timesheet: Timesheet) => {
    setEditingTimesheet(timesheet);
    setFormData({
      taskId: timesheet.taskId.toString(),
      projectId: timesheet.projectId.toString(),
      date: timesheet.date,
      hours: timesheet.hours.toString(),
      description: timesheet.description,
      billable: timesheet.billable,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this timesheet entry?")) {
      // TODO: Implement API call
      setTimesheets(timesheets.filter((t) => t.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      taskId: "",
      projectId: "",
      date: new Date().toISOString().split("T")[0],
      hours: "",
      description: "",
      billable: true,
    });
    setEditingTimesheet(null);
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      Draft: "bg-slate-100 text-slate-700 border-slate-200",
      Submitted: "bg-blue-100 text-blue-700 border-blue-200",
      Approved: "bg-green-100 text-green-700 border-green-200",
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${classes[status] || classes.Draft}`;
  };

  const totalHours = timesheets.reduce((sum, t) => sum + t.hours, 0);
  const billableHours = timesheets.filter((t) => t.billable).reduce((sum, t) => sum + t.hours, 0);
  const totalCost = timesheets.reduce((sum, t) => sum + (t.cost || 0), 0);

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
          <Link href="/timesheets/week" className="btn btn-outline btn-sm">
            <Clock className="w-4 h-4" />
            Weekly View
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
          Log Time
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Total Hours</h3>
            <p className="text-3xl font-bold mt-1 text-[#2563EB]">{totalHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Billable Hours</h3>
            <p className="text-3xl font-bold mt-1 text-[#16A34A]">{billableHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Total Cost</h3>
            <p className="text-3xl font-bold mt-1 text-[#1E293B]">${totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Timesheets Table */}
      <div className="card bg-white border border-[#E2E8F0] shadow-sm">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Task/Project</th>
                  <th className="text-left py-3 px-2 font-medium text-[#64748B]">Description</th>
                  <th className="text-right py-3 px-2 font-medium text-[#64748B]">Hours</th>
                  <th className="text-center py-3 px-2 font-medium text-[#64748B]">Billable</th>
                  <th className="text-center py-3 px-2 font-medium text-[#64748B]">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-[#64748B]">Cost</th>
                  <th className="text-right py-3 px-2 font-medium text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9]">
                    <td className="py-3 px-2 text-[#1E293B]">
                      {new Date(timesheet.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-[#1E293B] font-medium">Task #{timesheet.taskId}</div>
                      <div className="text-xs text-[#64748B]">Project #{timesheet.projectId}</div>
                    </td>
                    <td className="py-3 px-2 text-[#64748B]">{timesheet.description}</td>
                    <td className="py-3 px-2 text-right font-medium text-[#1E293B]">
                      {timesheet.hours}h
                    </td>
                    <td className="py-3 px-2 text-center">
                      {timesheet.billable ? (
                        <Check className="w-4 h-4 text-[#16A34A] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-[#64748B] mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={getStatusBadge(timesheet.status)}>{timesheet.status}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-[#1E293B]">
                      ${timesheet.cost?.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(timesheet)}
                          className="btn btn-ghost btn-xs"
                          disabled={timesheet.status === "Approved"}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(timesheet.id)}
                          className="btn btn-ghost btn-xs text-error"
                          disabled={timesheet.status === "Approved"}
                        >
                          Delete
                        </button>
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
                  {editingTimesheet ? "Edit Time Entry" : "Log Time"}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Task ID *</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.taskId}
                      onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Project ID *</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Date *</label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Hours *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      className="input input-bordered"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-sm font-medium text-[#1E293B]">Description</label>
                  <textarea
                    className="textarea textarea-bordered min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What did you work on?"
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
                    {editingTimesheet ? "Update" : "Log Time"}
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
