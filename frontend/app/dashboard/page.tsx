"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { projectAPI, taskAPI, type Project, type Task } from "@/lib/api";
import {
  Briefcase,
  CheckCircle,
  ClipboardList,
  Users,
  AlertTriangle,
  Plus,
} from "lucide-react";

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function formatDate(input: string) {
  const value = new Date(input);
  if (Number.isNaN(value.getTime())) {
    return "-";
  }
  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, taskData] = await Promise.all([
        projectAPI.list(),
        taskAPI.list(),
      ]);
      setProjects(projectData);
      setTasks(taskData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load dashboard data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dashboard = useMemo(() => {
    const totalProjects = projects.length;
    const inProgressProjects = projects.filter((p) => p.status === "In Progress").length;
    const completedProjects = projects.filter((p) => p.status === "Completed").length;
    const totalTeamSize = projects.reduce((sum, project) => sum + (project.teamSize || 0), 0);
    const averageTeamSize = totalProjects ? Math.round(totalTeamSize / totalProjects) : 0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.state === "Done").length;
    const openTasks = tasks.filter((t) => t.state !== "Done");
    const highPriorityOpen = openTasks.filter((t) => t.priority === "High").length;
    const taskCompletionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextFortnight = new Date(today);
    nextFortnight.setDate(today.getDate() + 14);

    const upcomingProjects = projects
      .filter((project) => {
        const deadline = new Date(project.deadline);
        if (Number.isNaN(deadline.getTime())) return false;
        return deadline >= today && deadline <= nextFortnight;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 4);

    const overdueTasks = openTasks
      .filter((task) => {
        const due = new Date(task.due);
        if (Number.isNaN(due.getTime())) return false;
        return due < today;
      })
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
      .slice(0, 4);

    const focusTasks = [...openTasks]
      .sort((a, b) => {
        const priorityDelta = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        if (priorityDelta !== 0) return priorityDelta;
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      })
      .slice(0, 5);

    const stateCounts = {
      new: tasks.filter((t) => t.state === "New").length,
      inProgress: tasks.filter((t) => t.state === "In Progress").length,
      done: completedTasks,
    };

    return {
      totalProjects,
      inProgressProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      highPriorityOpen,
      taskCompletionRate,
      averageTeamSize,
      upcomingProjects,
      overdueTasks,
      focusTasks,
      stateCounts,
    };
  }, [projects, tasks]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="loading loading-spinner loading-lg text-[#2563EB]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="alert alert-error bg-red-100 border border-red-400 text-red-700">
          <AlertTriangle className="h-6 w-6 text-red-700" />
          <span>{error}</span>
          <button className="btn btn-sm bg-red-500 text-white hover:bg-red-600" onClick={loadData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] p-4 md:p-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link href="/projects/new" className="btn btn-primary gap-2">
            <Plus size={16} /> New Project
          </Link>
          <Link href="/tasks" className="btn btn-outline">
            Review Tasks
          </Link>
          <Link href="/analytics" className="btn btn-ghost">
            Analytics
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Briefcase}
          title="Total Projects"
          value={dashboard.totalProjects}
          description={`${dashboard.inProgressProjects} active · ${dashboard.completedProjects} completed`}
        />
        <StatCard
          icon={ClipboardList}
          title="Open Tasks"
          value={dashboard.totalTasks - dashboard.completedTasks}
          description={`${dashboard.highPriorityOpen} high priority`}
        />
        <StatCard
          icon={CheckCircle}
          title="Task Completion"
          value={`${dashboard.taskCompletionRate}%`}
          description={`${dashboard.completedTasks} of ${dashboard.totalTasks} tasks done`}
        >
          <progress className="progress progress-primary mt-2" value={dashboard.taskCompletionRate} max={100} />
        </StatCard>
        <StatCard
          icon={Users}
          title="Avg. Team Size"
          value={dashboard.averageTeamSize}
          description="members per project"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card bg-white shadow border border-[#E2E8F0] lg:col-span-2">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Upcoming Deadlines</h2>
              <Link href="/projects" className="text-sm font-semibold text-[#2563EB] hover:underline">
                View all
              </Link>
            </div>
            {dashboard.upcomingProjects.length === 0 ? (
              <p className="text-sm text-[#64748B]">No deadlines in the next two weeks.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.upcomingProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC]">
                    <div>
                      <p className="font-semibold text-[#1E293B]">{project.name}</p>
                      <p className="text-sm text-[#64748B]">Managed by {project.manager}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2563EB]">Due {formatDate(project.deadline)}</p>
                      <p className="text-xs text-[#64748B]">Status: {project.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-white shadow border border-[#E2E8F0]">
          <div className="card-body gap-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Task Status</h2>
            {dashboard.totalTasks === 0 ? (
              <p className="text-sm text-[#64748B]">No tasks available.</p>
            ) : (
              <>
                <div className="flex h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="bg-[#3B82F6]"
                    style={{ width: `${(dashboard.stateCounts.new / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                  <div
                    className="bg-[#F59E0B]"
                    style={{ width: `${(dashboard.stateCounts.inProgress / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                  <div
                    className="bg-[#10B981]"
                    style={{ width: `${(dashboard.stateCounts.done / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#3B82F6]"><div className="w-2 h-2 rounded-full bg-current" />New</span>
                    <span className="font-semibold">{dashboard.stateCounts.new}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#F59E0B]"><div className="w-2 h-2 rounded-full bg-current" />In Progress</span>
                    <span className="font-semibold">{dashboard.stateCounts.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#10B981]"><div className="w-2 h-2 rounded-full bg-current" />Done</span>
                    <span className="font-semibold">{dashboard.stateCounts.done}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-white shadow border border-[#E2E8F0]">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Focus Tasks</h2>
              <Link href="/tasks" className="text-sm font-semibold text-[#2563EB] hover:underline">
                Manage tasks
              </Link>
            </div>
            {dashboard.focusTasks.length === 0 ? (
              <p className="text-sm text-[#64748B]">All tasks are complete. Great job!</p>
            ) : (
              <div className="space-y-3">
                {dashboard.focusTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between rounded-lg border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC]">
                    <div>
                      <p className="font-semibold text-[#1E293B]">{task.title}</p>
                      <p className="text-sm text-[#64748B]">Project: {task.project}</p>
                      <p className="text-xs text-[#64748B]">Assignee: {task.assignee}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        task.priority === "High" ? "badge-error" : task.priority === "Medium" ? "badge-warning" : "badge-ghost"
                      } text-xs`}>
                        {task.priority}
                      </span>
                      <p className="mt-2 text-xs text-[#64748B]">Due {formatDate(task.due)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-white shadow border border-[#E2E8F0]">
          <div className="card-body gap-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Overdue Tasks</h2>
            {dashboard.overdueTasks.length === 0 ? (
              <p className="text-sm text-[#64748B]">No overdue work items. Keep it up!</p>
            ) : (
              <div className="space-y-3">
                {dashboard.overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                    <div>
                      <p className="font-semibold text-red-600">{task.title}</p>
                      <p className="text-sm text-red-500">Project: {task.project}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-red-600">Due {formatDate(task.due)}</p>
                      <p className="text-xs text-red-500">Assignee: {task.assignee}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, description, children }: {
  icon: React.ElementType,
  title: string,
  value: string | number,
  description: string,
  children?: React.ReactNode
}) => (
  <div className="card bg-white shadow border border-[#E2E8F0]">
    <div className="card-body">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#64748B] uppercase">{title}</h3>
          <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
        </div>
      </div>
      {children || <p className="text-sm text-[#64748B] mt-2">{description}</p>}
      {!children && description && <p className="text-sm text-[#64748B] mt-2">{description}</p>}
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
