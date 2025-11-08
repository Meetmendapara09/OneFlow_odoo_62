"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

const TASKS = [
  { 
    id: "t1", 
    title: "Design Wireframes", 
    description: "Create low-fidelity wireframes for the new student portal interface. Focus on user experience and accessibility.",
    project: "Student Portal Revamp", 
    projectId: "p1",
    assignee: "Jane", 
    due: "2025-11-20", 
    priority: "High" as const, 
    state: "In Progress" as const,
    tags: ["design", "UI"],
    subtaskProgress: { completed: 3, total: 5 },
    createdDate: "2025-11-01",
    estimatedHours: 40,
    actualHours: 28,
  },
  { 
    id: "t2", 
    title: "HR API Mapping", 
    description: "Map HR API endpoints to our system data structure. Document all integration points.",
    project: "HRMS Integration", 
    projectId: "p2",
    assignee: "Raj", 
    due: "2025-12-01", 
    priority: "Medium" as const, 
    state: "New" as const,
    tags: ["backend", "API"],
    subtaskProgress: { completed: 0, total: 8 },
    createdDate: "2025-11-05",
    estimatedHours: 60,
    actualHours: 0,
  },
  { 
    id: "t3", 
    title: "Approval Flow Implementation", 
    description: "Build the approval workflow for finance requests with multi-level authorization.",
    project: "Finance Workflows", 
    projectId: "p3",
    assignee: "Sara", 
    due: "2025-11-15", 
    priority: "High" as const, 
    state: "Blocked" as const,
    tags: ["backend", "workflow"],
    subtaskProgress: { completed: 4, total: 6 },
    createdDate: "2025-10-20",
    estimatedHours: 50,
    actualHours: 35,
    blockedReason: "Waiting for API access from finance team",
  },
  { 
    id: "t4", 
    title: "Deploy to Production", 
    description: "Final deployment of AI pilot to production environment with monitoring setup.",
    project: "AI Pilot", 
    projectId: "p4",
    assignee: "Neil", 
    due: "2025-09-20", 
    priority: "Low" as const, 
    state: "Done" as const,
    tags: ["deployment"],
    subtaskProgress: { completed: 10, total: 10 },
    createdDate: "2025-09-10",
    estimatedHours: 16,
    actualHours: 18,
    completedDate: "2025-09-19",
  },
  { 
    id: "t5", 
    title: "Database Schema Design", 
    description: "Design the database schema for library management with proper normalization.",
    project: "Library Management System", 
    projectId: "p6",
    assignee: "Jane", 
    due: "2025-11-25", 
    priority: "High" as const, 
    state: "In Progress" as const,
    tags: ["database", "backend"],
    subtaskProgress: { completed: 2, total: 4 },
    createdDate: "2025-11-08",
    estimatedHours: 32,
    actualHours: 16,
  },
  { 
    id: "t6", 
    title: "IoT Sensor Configuration", 
    description: "Configure temperature and occupancy sensors across campus buildings.",
    project: "Campus IoT Network", 
    projectId: "p5",
    assignee: "Raj", 
    due: "2025-11-18", 
    priority: "Medium" as const, 
    state: "In Progress" as const,
    tags: ["IoT", "hardware"],
    subtaskProgress: { completed: 5, total: 7 },
    createdDate: "2025-11-02",
    estimatedHours: 80,
    actualHours: 56,
  },
];

const SUBTASKS = {
  t1: [
    { id: "st1", title: "Homepage wireframe", completed: true },
    { id: "st2", title: "Dashboard wireframe", completed: true },
    { id: "st3", title: "Profile page wireframe", completed: true },
    { id: "st4", title: "Settings page wireframe", completed: false },
    { id: "st5", title: "Navigation structure", completed: false },
  ],
  t2: [
    { id: "st6", title: "Authentication endpoint", completed: false },
    { id: "st7", title: "User data sync", completed: false },
    { id: "st8", title: "Payroll integration", completed: false },
    { id: "st9", title: "Leave management", completed: false },
    { id: "st10", title: "Performance tracking", completed: false },
    { id: "st11", title: "Attendance logs", completed: false },
    { id: "st12", title: "Error handling", completed: false },
    { id: "st13", title: "Documentation", completed: false },
  ],
  t3: [
    { id: "st14", title: "Define approval levels", completed: true },
    { id: "st15", title: "Create workflow engine", completed: true },
    { id: "st16", title: "Implement notifications", completed: true },
    { id: "st17", title: "Build approval UI", completed: true },
    { id: "st18", title: "Testing", completed: false },
    { id: "st19", title: "Deploy", completed: false },
  ],
  t4: [
    { id: "st20", title: "Code review", completed: true },
    { id: "st21", title: "Testing", completed: true },
    { id: "st22", title: "Staging deployment", completed: true },
    { id: "st23", title: "Performance check", completed: true },
    { id: "st24", title: "Production deployment", completed: true },
    { id: "st25", title: "Monitoring setup", completed: true },
    { id: "st26", title: "Documentation", completed: true },
    { id: "st27", title: "Team training", completed: true },
    { id: "st28", title: "Rollback plan", completed: true },
    { id: "st29", title: "Post-deployment check", completed: true },
  ],
  t5: [
    { id: "st30", title: "Requirements gathering", completed: true },
    { id: "st31", title: "ER diagram", completed: true },
    { id: "st32", title: "Normalization", completed: false },
    { id: "st33", title: "Indexing strategy", completed: false },
  ],
  t6: [
    { id: "st34", title: "Sensor inventory", completed: true },
    { id: "st35", title: "Network setup", completed: true },
    { id: "st36", title: "Building A sensors", completed: true },
    { id: "st37", title: "Building B sensors", completed: true },
    { id: "st38", title: "Building C sensors", completed: true },
    { id: "st39", title: "Testing & calibration", completed: false },
    { id: "st40", title: "Documentation", completed: false },
  ],
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const task = useMemo(() => {
    return TASKS.find(t => t.id === taskId);
  }, [taskId]);

  const subtasks = useMemo(() => {
    return SUBTASKS[taskId as keyof typeof SUBTASKS] || [];
  }, [taskId]);

  if (!task) {
    return (
      <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
        <div className="alert bg-[#FEF2F2] border border-[#EF4444]/30 text-[#7F1D1D]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Task not found</span>
        </div>
        <Link href="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const getStateBadgeClass = () => {
    switch (task.state) {
      case "Done": return "badge-success";
      case "In Progress": return "badge-primary";
      case "Blocked": return "badge-error";
      case "New": return "badge-neutral";
      default: return "";
    }
  };

  const getPriorityBadgeClass = () => {
    switch (task.priority) {
      case "High": return "badge-error";
      case "Medium": return "badge-warning";
      case "Low": return "badge-neutral";
      default: return "";
    }
  };

  const daysLeft = Math.ceil((new Date(task.due).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0 && task.state !== "Done";
  const hoursProgress = task.estimatedHours ? (task.actualHours / task.estimatedHours) * 100 : 0;

  return (
    <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-[#1E293B]">{task.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
              task.state === 'Done' ? 'bg-green-100 text-green-700 border-green-200' :
              task.state === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              task.state === 'Blocked' ? 'bg-red-100 text-red-700 border-red-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>{task.state}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
              task.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
              task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>{task.priority}</span>
            {task.tags?.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Blocked Alert */}
      {task.state === "Blocked" && task.blockedReason && (
        <div className="alert bg-[#FFFBEB] border border-[#F59E0B]/30 text-[#7C2D12]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm"><strong>Blocked:</strong> {task.blockedReason}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Progress</h3>
            <p className="text-3xl font-bold mt-1 text-[#2563EB]">
              {task.subtaskProgress ? Math.round((task.subtaskProgress.completed / task.subtaskProgress.total) * 100) : 0}%
            </p>
            <p className="text-sm text-[#64748B]">{task.subtaskProgress?.completed || 0} of {task.subtaskProgress?.total || 0} subtasks</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Time Tracking</h3>
            <p className="text-3xl font-bold mt-1 text-[#1E293B]">{task.actualHours}h</p>
            <p className="text-sm text-[#64748B]">of {task.estimatedHours}h estimated ({hoursProgress.toFixed(0)}%)</p>
          </div>
        </div>
        <div className="card bg-white border border-[#E2E8F0] shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">Due Date</h3>
            <p className={`text-3xl font-bold mt-1 ${isOverdue ? 'text-[#DC2626]' : 'text-[#1E293B]' }`}>
              {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-sm text-[#64748B]">
              {isOverdue ? (
                <span className="text-[#DC2626]">{Math.abs(daysLeft)} days overdue</span>
              ) : task.state === "Done" ? (
                <span className="text-[#16A34A]">Completed</span>
              ) : (
                <span>{daysLeft} days remaining</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B]">Description</h2>
              <p className="text-[#64748B]">{task.description}</p>
            </div>
          </div>

          {/* Subtasks */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1E293B]">Subtasks</h2>
                <span className="text-[#64748B] text-sm">
                  {task.subtaskProgress?.completed || 0} / {task.subtaskProgress?.total || 0} completed
                </span>
              </div>
              
              {subtasks.length > 0 ? (
                <div className="space-y-2">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F1F5F9]">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        readOnly
                        className="w-5 h-5 rounded border-[#E2E8F0] accent-[#2563EB]"
                      />
                      <span className={`flex-1 ${subtask.completed ? "line-through text-[#94A3B8]" : "text-[#1E293B]"}`}>
                        {subtask.title}
                      </span>
                      {subtask.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert bg-[#EFF6FF] border border-[#2563EB]/20 text-[#1E293B]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">No subtasks defined for this task.</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                    <div className="w-0.5 h-full bg-[#16A34A]"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-[#1E293B]">Task Created</p>
                    <p className="text-sm text-[#64748B]">
                      {new Date(task.createdDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                
                {task.actualHours > 0 && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                      <div className="w-0.5 h-full bg-[#2563EB]"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-[#1E293B]">Work Started</p>
                      <p className="text-sm text-[#64748B]">{task.actualHours} hours logged so far</p>
                    </div>
                  </div>
                )}
                
                {task.state === "Done" && task.completedDate && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-[#16A34A]">Task Completed</p>
                      <p className="text-sm text-[#64748B]">
                        {new Date(task.completedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
                
                {task.state !== "Done" && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#E2E8F0]"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-[#64748B]">Target Completion</p>
                      <p className="text-sm text-[#64748B]">
                        {new Date(task.due).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Task Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#64748B]">Project</p>
                  <Link href={`/projects/${task.projectId}`} className="link link-primary font-medium">
                    {task.project}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-[#64748B]">Assignee</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                      {task.assignee[0]}
                    </div>
                    <p className="font-medium text-[#1E293B]">{task.assignee}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#64748B]">Created</p>
                  <p className="font-medium text-[#1E293B]">
                    {new Date(task.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                {task.completedDate && (
                  <div>
                    <p className="text-sm text-[#64748B]">Completed</p>
                    <p className="font-medium text-[#16A34A]">
                      {new Date(task.completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Time Tracking</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Estimated:</span>
                  <span className="font-semibold text-[#1E293B]">{task.estimatedHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Actual:</span>
                  <span className="font-semibold text-[#1E293B]">{task.actualHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Remaining:</span>
                  <span className={`font-semibold ${task.actualHours > task.estimatedHours ? "text-[#DC2626]" : "text-[#1E293B]"}`}>
                    {Math.max(0, task.estimatedHours - task.actualHours)}h
                  </span>
                </div>
                <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${hoursProgress > 100 ? 'bg-[#DC2626]' : 'bg-[#2563EB]'}`}
                    style={{ width: `${Math.min(100, hoursProgress)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card bg-white border border-[#E2E8F0] shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Actions</h2>
              <div className="space-y-2">
                <Link href={`/tasks?edit=${taskId}`} className="btn btn-primary btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Task
                </Link>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Log Time
                </button>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Add Comment
                </button>
                {task.state !== "Done" && (
                  <button className="btn btn-success btn-sm w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
