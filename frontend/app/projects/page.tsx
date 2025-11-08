"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  deadline: string;
}

const DATA: Project[] = [
  { id: "p1", name: "Student Portal Revamp", description: "UI modernization and performance work.", manager: "A. Patel", status: "In Progress", progress: 55, deadline: "2025-12-01" },
  { id: "p2", name: "HRMS Integration", description: "Sync HR data with core systems.", manager: "R. Singh", status: "Planned", progress: 10, deadline: "2026-01-15" },
  { id: "p3", name: "Finance Workflows", description: "Streamline approvals and reporting.", manager: "S. Kumar", status: "On Hold", progress: 35, deadline: "2026-03-01" },
  { id: "p4", name: "AI Pilot", description: "Internal experimentation with ML models.", manager: "N. Shah", status: "Completed", progress: 100, deadline: "2025-10-01" },
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <div key={p.id} className="card bg-base-100 shadow border border-base-300 transition hover:shadow-lg">
            <div className="card-body gap-3">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-base">{p.name}</h2>
                <span className={`badge ${
                  p.status === "Completed" ? "badge-success" :
                  p.status === "In Progress" ? "badge-info" :
                  p.status === "Planned" ? "" : "badge-warning"
                }`}>{p.status}</span>
              </div>
              <p className="text-sm text-base-content/70">{p.description}</p>
              <div className="text-xs text-base-content/60">
                <p>Manager: <span className="font-medium">{p.manager}</span></p>
                <p>Deadline: {new Date(p.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <progress className="progress progress-primary w-full" value={p.progress} max={100} />
              </div>
              <div className="card-actions justify-end">
                <Link href={`/projects/${p.id}`} className="btn btn-sm btn-primary">Open</Link>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="alert">
            <span>No projects match your filters.</span>
          </div>
        )}
      </div>
    </div>
  );
}

