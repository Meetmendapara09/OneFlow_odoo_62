"use client";
import React, { useMemo, useState } from "react";

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  due: string; // ISO
  priority: "Low" | "Medium" | "High";
  state: "New" | "In Progress" | "Blocked" | "Done";
}

const DATA: Task[] = [
  { id: "t1", title: "Wireframes", project: "Student Portal Revamp", assignee: "Jane", due: "2025-11-20", priority: "High", state: "In Progress" },
  { id: "t2", title: "HR API mapping", project: "HRMS Integration", assignee: "Raj", due: "2025-12-01", priority: "Medium", state: "New" },
  { id: "t3", title: "Approval flow", project: "Finance Workflows", assignee: "Sara", due: "2025-11-15", priority: "High", state: "Blocked" },
  { id: "t4", title: "Deploy", project: "AI Pilot", assignee: "Neil", due: "2025-09-20", priority: "Low", state: "Done" },
];

const STATES: Task["state"][] = ["New", "In Progress", "Blocked", "Done"];

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"All" | Task["state"]>("All");
  const [mineOnly, setMineOnly] = useState(false);

  const filtered = useMemo(() => {
    const me = "Jane"; // placeholder: current user
    return DATA.filter(t =>
      (state === "All" || t.state === state) &&
      (query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase())) &&
      (!mineOnly || t.assignee === me)
    );
  }, [query, state, mineOnly]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search tasks"
            className="input input-bordered"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="label cursor-pointer gap-2">
            <span className="label-text">My tasks</span>
            <input type="checkbox" className="toggle" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
          </label>
          <button className="btn btn-primary">New Task</button>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-boxed">
        <a role="tab" className={`tab ${state === "All" ? "tab-active" : ""}`} onClick={() => setState("All")}>All</a>
        {STATES.map(s => (
          <a role="tab" key={s} className={`tab ${state === s ? "tab-active" : ""}`} onClick={() => setState(s)}>{s}</a>
        ))}
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Due</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="font-medium">{t.title}</td>
                <td>{t.project}</td>
                <td>{t.assignee}</td>
                <td>{new Date(t.due).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${t.priority === "High" ? "badge-error" : t.priority === "Medium" ? "badge-warning" : "badge-ghost"}`}>{t.priority}</span>
                </td>
                <td>
                  <span className={`badge ${t.state === "Done" ? "badge-success" : t.state === "In Progress" ? "badge-info" : t.state === "Blocked" ? "badge-error" : "badge-ghost"}`}>{t.state}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="alert">
                    <span>No tasks match your filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

