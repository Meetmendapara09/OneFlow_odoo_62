"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { projectAPI, taskAPI, type Project, type Task } from "@/lib/api";

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

export default function DashboardPage() {
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm" onClick={loadData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-base-content/70">Centralized view of project health and team workload.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link href="/tasks" className="btn btn-outline">
            Review Tasks
          </Link>
          <Link href="/analytics" className="btn btn-ghost">
            Analytics
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-xs uppercase tracking-wide text-base-content/60">Total Projects</h3>
            <p className="text-3xl font-semibold">{dashboard.totalProjects}</p>
            <p className="text-sm text-base-content/70">{dashboard.inProgressProjects} active · {dashboard.completedProjects} completed</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-xs uppercase tracking-wide text-base-content/60">Open Tasks</h3>
            <p className="text-3xl font-semibold">{dashboard.totalTasks - dashboard.completedTasks}</p>
            <p className="text-sm text-base-content/70">{dashboard.highPriorityOpen} high priority awaiting action</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wide text-base-content/60">Task Completion</h3>
              <span className="text-sm font-semibold">{dashboard.taskCompletionRate}%</span>
            </div>
            <progress className="progress progress-primary mt-2" value={dashboard.taskCompletionRate} max={100} />
            <p className="text-sm text-base-content/70">{dashboard.completedTasks} of {dashboard.totalTasks} tasks completed</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-xs uppercase tracking-wide text-base-content/60">Team Load</h3>
            <p className="text-3xl font-semibold">{dashboard.averageTeamSize}</p>
            <p className="text-sm text-base-content/70">Average team members per project</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card bg-base-100 shadow lg:col-span-2">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Upcoming Deadlines</h2>
              <Link href="/projects" className="link link-primary text-sm">
                View all
              </Link>
            </div>
            {dashboard.upcomingProjects.length === 0 ? (
              <p className="text-sm text-base-content/70">No deadlines in the next two weeks.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.upcomingProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between rounded-lg border border-base-200 p-3">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-base-content/70">Managed by {project.manager}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">Due {formatDate(project.deadline)}</p>
                      <p className="text-xs text-base-content/60">Status: {project.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">Task Status</h2>
            {dashboard.totalTasks === 0 ? (
              <p className="text-sm text-base-content/70">No tasks available.</p>
            ) : (
              <>
                <div className="flex h-2 overflow-hidden rounded-full bg-base-300">
                  <div
                    className="bg-info"
                    style={{ width: `${(dashboard.stateCounts.new / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                  <div
                    className="bg-warning"
                    style={{ width: `${(dashboard.stateCounts.inProgress / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                  <div
                    className="bg-success"
                    style={{ width: `${(dashboard.stateCounts.done / dashboard.totalTasks) * 100 || 0}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-info">New</span>
                    <span>{dashboard.stateCounts.new}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-warning">In Progress</span>
                    <span>{dashboard.stateCounts.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-success">Done</span>
                    <span>{dashboard.stateCounts.done}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Focus Tasks</h2>
              <Link href="/tasks" className="link link-primary text-sm">
                Manage tasks
              </Link>
            </div>
            {dashboard.focusTasks.length === 0 ? (
              <p className="text-sm text-base-content/70">All tasks are complete. Great job!</p>
            ) : (
              <div className="space-y-3">
                {dashboard.focusTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between rounded-lg border border-base-200 p-3">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-base-content/70">Project: {task.project}</p>
                      <p className="text-xs text-base-content/60">Assignee: {task.assignee}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${task.priority === "High" ? "badge-error" : task.priority === "Medium" ? "badge-warning" : "badge-ghost"}`}>
                        {task.priority}
                      </span>
                      <p className="mt-2 text-xs text-base-content/60">Due {formatDate(task.due)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">Overdue Tasks</h2>
            {dashboard.overdueTasks.length === 0 ? (
              <p className="text-sm text-base-content/70">No overdue work items. Keep it up!</p>
            ) : (
              <div className="space-y-3">
                {dashboard.overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between rounded-lg border border-error/40 bg-error/10 p-3">
                    <div>
                      <p className="font-medium text-error">{task.title}</p>
                      <p className="text-sm text-base-content/80">Project: {task.project}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-error">Due {formatDate(task.due)}</p>
                      <p className="text-xs text-base-content/60">Assignee: {task.assignee}</p>
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
