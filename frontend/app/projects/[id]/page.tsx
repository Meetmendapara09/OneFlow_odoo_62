"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

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

  const project = useMemo(() => {
    return PROJECTS.find(p => p.id === projectId);
  }, [projectId]);

  const tasks = useMemo(() => {
    return PROJECT_TASKS[projectId as keyof typeof PROJECT_TASKS] || [];
  }, [projectId]);

  const team = useMemo(() => {
    return TEAM_MEMBERS[projectId as keyof typeof TEAM_MEMBERS] || [];
  }, [projectId]);

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Project not found</span>
        </div>
        <Link href="/projects" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const getStatusBadgeClass = () => {
    switch (project.status) {
      case "Completed": return "badge-success";
      case "In Progress": return "badge-primary";
      case "Planned": return "badge-secondary";
      case "On Hold": return "badge-warning";
      default: return "";
    }
  };

  const getStateBadgeClass = (state: string) => {
    switch (state) {
      case "Done": return "badge-success";
      case "In Progress": return "badge-primary";
      case "Blocked": return "badge-error";
      case "New": return "badge-neutral";
      default: return "";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "High": return "badge-error";
      case "Medium": return "badge-warning";
      case "Low": return "badge-neutral";
      default: return "";
    }
  };

  const budgetUsed = project.spent && project.budget ? (project.spent / project.budget) * 100 : 0;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0 && project.status !== "Completed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold flex-1">{project.name}</h1>
        <span className={`badge ${getStatusBadgeClass()} badge-lg`}>{project.status}</span>
      </div>

      {/* Project Overview Card */}
      <div className="card card-primary">
        <div className="card-body">
          <h2 className="card-title">Project Overview</h2>
          <p className="text-muted">{project.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted">Project Manager:</span>
                <span className="font-semibold">{project.manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Team Size:</span>
                <span className="font-semibold">{project.teamSize} members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Deadline:</span>
                <span className={`font-semibold ${isOverdue ? "text-error" : ""}`}>
                  {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {isOverdue && <span className="ml-2 text-error text-xs">(Overdue)</span>}
                  {!isOverdue && daysLeft >= 0 && <span className="ml-2 text-muted text-xs">({daysLeft} days left)</span>}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted">Tasks:</span>
                <span className="font-semibold">{project.tasksCompleted}/{project.totalTasks} completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Budget:</span>
                <span className="font-semibold">${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Spent:</span>
                <span className="font-semibold metric-cost">${project.spent?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Overall Progress</div>
          <div className="stat-value text-primary">{project.progress}%</div>
          <div className="stat-desc">
            <div className="progress progress-primary mt-2">
              <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Budget Used</div>
          <div className="stat-value metric-hours">{budgetUsed.toFixed(0)}%</div>
          <div className="stat-desc">
            <div className="progress progress-warning mt-2">
              <div className="progress-bar" style={{ width: `${budgetUsed}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Task Completion</div>
          <div className="stat-value metric-profit">
            {project.totalTasks > 0 ? Math.round((project.tasksCompleted / project.totalTasks) * 100) : 0}%
          </div>
          <div className="stat-desc">{project.tasksCompleted} of {project.totalTasks} tasks done</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">Project Tasks</h2>
                <Link href="/tasks" className="btn btn-primary btn-sm">
                  View All Tasks
                </Link>
              </div>
              
              {tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-base-300">
                        <th className="text-left py-3 px-2">Task</th>
                        <th className="text-left py-3 px-2">Assignee</th>
                        <th className="text-left py-3 px-2">Due Date</th>
                        <th className="text-left py-3 px-2">Priority</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr key={task.id} className="border-b border-base-300 hover:bg-base-200">
                          <td className="py-3 px-2 font-medium">{task.title}</td>
                          <td className="py-3 px-2">{task.assignee}</td>
                          <td className="py-3 px-2 text-sm">
                            {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`badge badge-sm ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`badge badge-sm ${getStateBadgeClass(task.state)}`}>
                              {task.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No tasks assigned to this project yet.</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="card card-success">
            <div className="card-body">
              <h2 className="card-title mb-4">Project Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <div className="w-0.5 h-full bg-success"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold">Project Created</p>
                    <p className="text-sm text-muted">Initial planning and setup</p>
                  </div>
                </div>
                
                {project.progress > 0 && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-base-300"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold">Development Started</p>
                      <p className="text-sm text-muted">Team began implementation</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${project.status === "Completed" ? "bg-success" : "bg-base-300"}`}></div>
                  </div>
                  <div>
                    <p className={`font-semibold ${project.status === "Completed" ? "" : "text-muted"}`}>
                      Project Completion
                    </p>
                    <p className="text-sm text-muted">
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
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Team Members</h2>
              <div className="space-y-3">
                {team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
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
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card card-warning">
            <div className="card-body">
              <h2 className="card-title mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href={`/projects?edit=${projectId}`} className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Project
                </Link>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Manage Team
                </button>
                <button className="btn btn-outline btn-sm w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
