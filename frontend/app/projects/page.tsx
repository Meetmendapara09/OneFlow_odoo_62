"use client";
import React, { useMemo, useState } from "react";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";

type Project = ProjectCardProps;

const DATA: Project[] = [
  { id: "p1", name: "Student Portal Revamp", description: "UI modernization and performance work.", manager: "A. Patel", status: "In Progress", progress: 55, deadline: "2025-12-01", teamSize: 5, tasksCompleted: 12, totalTasks: 20 },
  { id: "p2", name: "HRMS Integration", description: "Sync HR data with core systems.", manager: "R. Singh", status: "Planned", progress: 10, deadline: "2026-01-15", teamSize: 3, tasksCompleted: 2, totalTasks: 15 },
  { id: "p3", name: "Finance Workflows", description: "Streamline approvals and reporting.", manager: "S. Kumar", status: "On Hold", progress: 35, deadline: "2026-03-01", teamSize: 4, tasksCompleted: 7, totalTasks: 18 },
  { id: "p4", name: "AI Pilot", description: "Internal experimentation with ML models.", manager: "N. Shah", status: "Completed", progress: 100, deadline: "2025-10-01", teamSize: 6, tasksCompleted: 25, totalTasks: 25 },
  { id: "p5", name: "Campus IoT Network", description: "Deploy IoT sensors across campus for smart building management.", manager: "V. Mehta", status: "In Progress", progress: 68, deadline: "2025-11-30", teamSize: 8, tasksCompleted: 17, totalTasks: 25 },
  { id: "p6", name: "Library Management System", description: "Modernize library cataloging and borrowing system.", manager: "K. Desai", status: "Planned", progress: 5, deadline: "2026-02-01", teamSize: 4, tasksCompleted: 1, totalTasks: 22 },
];

const STATUSES: Project["status"][] = ["Planned", "In Progress", "Completed", "On Hold"];

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | Project["status"]>("All");

  const filtered = useMemo(() => {
    return DATA.filter(p =>
      (status === "All" || p.status === status) &&
      (query.trim() === "" || p.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, status]);

  const stats = useMemo(() => {
    const total = DATA.length;
    const inProgress = DATA.filter(p => p.status === "In Progress").length;
    const completed = DATA.filter(p => p.status === "Completed").length;
    const planned = DATA.filter(p => p.status === "Planned").length;
    return { total, inProgress, completed, planned };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search projects"
            className="input input-bordered"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary">New Project</button>
        </div>
      </div>

  <div className="stats shadow bg-base-100 rounded-box">
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-secondary">{stats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value">{stats.completed}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Planned</div>
          <div className="stat-value">{stats.planned}</div>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-boxed">
        <a role="tab" className={`tab ${status === "All" ? "tab-active" : ""}`} onClick={() => setStatus("All")}>All</a>
        {STATUSES.map(s => (
          <a role="tab" key={s} className={`tab ${status === s ? "tab-active" : ""}`} onClick={() => setStatus(s)}>{s}</a>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No projects match your filters.</span>
        </div>
      )}
    </div>
  );
}

