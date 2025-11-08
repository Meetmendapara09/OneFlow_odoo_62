"use client";
import React, { useMemo, useState } from "react";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";

type Task = TaskCardProps;

const DATA: Task[] = [
  { 
    id: "t1", 
    title: "Design Wireframes", 
    description: "Create low-fidelity wireframes for the new student portal interface",
    project: "Student Portal Revamp", 
    projectId: "p1",
    assignee: "Jane", 
    due: "2025-11-20", 
    priority: "High", 
    state: "In Progress",
    tags: ["design", "UI"],
    subtaskProgress: { completed: 3, total: 5 }
  },
  { 
    id: "t2", 
    title: "HR API Mapping", 
    description: "Map HR API endpoints to our system data structure",
    project: "HRMS Integration", 
    projectId: "p2",
    assignee: "Raj", 
    due: "2025-12-01", 
    priority: "Medium", 
    state: "New",
    tags: ["backend", "API"],
    subtaskProgress: { completed: 0, total: 8 }
  },
  { 
    id: "t3", 
    title: "Approval Flow Implementation", 
    description: "Build the approval workflow for finance requests",
    project: "Finance Workflows", 
    projectId: "p3",
    assignee: "Sara", 
    due: "2025-11-15", 
    priority: "High", 
    state: "Blocked",
    tags: ["backend", "workflow"],
    subtaskProgress: { completed: 4, total: 6 }
  },
  { 
    id: "t4", 
    title: "Deploy to Production", 
    description: "Final deployment of AI pilot to production environment",
    project: "AI Pilot", 
    projectId: "p4",
    assignee: "Neil", 
    due: "2025-09-20", 
    priority: "Low", 
    state: "Done",
    tags: ["deployment"],
    subtaskProgress: { completed: 10, total: 10 }
  },
  { 
    id: "t5", 
    title: "Database Schema Design", 
    description: "Design the database schema for library management",
    project: "Library Management System", 
    projectId: "p6",
    assignee: "Jane", 
    due: "2025-11-25", 
    priority: "High", 
    state: "In Progress",
    tags: ["database", "backend"],
    subtaskProgress: { completed: 2, total: 4 }
  },
  { 
    id: "t6", 
    title: "IoT Sensor Configuration", 
    description: "Configure temperature and occupancy sensors",
    project: "Campus IoT Network", 
    projectId: "p5",
    assignee: "Raj", 
    due: "2025-11-18", 
    priority: "Medium", 
    state: "In Progress",
    tags: ["IoT", "hardware"],
    subtaskProgress: { completed: 5, total: 7 }
  },
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

  const stats = useMemo(() => {
    const total = DATA.length;
    const inProgress = DATA.filter(t => t.state === "In Progress").length;
    const done = DATA.filter(t => t.state === "Done").length;
    const blocked = DATA.filter(t => t.state === "Blocked").length;
    const myTasks = DATA.filter(t => t.assignee === "Jane").length; // placeholder
    return { total, inProgress, done, blocked, myTasks };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search tasks"
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-border accent-primary"
              checked={mineOnly} 
              onChange={(e) => setMineOnly(e.target.checked)} 
            />
            <span className="text-sm">My tasks</span>
          </label>
          <button className="btn btn-primary">New Task</button>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-secondary">{stats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value metric-profit">{stats.done}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Blocked</div>
          <div className="stat-value text-error">{stats.blocked}</div>
        </div>
        <div className="stat">
          <div className="stat-title">My Tasks</div>
          <div className="stat-value metric-hours">{stats.myTasks}</div>
        </div>
      </div>

      <div role="tablist" className="flex gap-2 flex-wrap">
        <button 
          className={`btn btn-sm ${state === "All" ? "btn-primary" : "btn-ghost"}`} 
          onClick={() => setState("All")}
        >
          All
        </button>
        {STATES.map(s => (
          <button 
            key={s}
            className={`btn btn-sm ${state === s ? "btn-primary" : "btn-ghost"}`} 
            onClick={() => setState(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t => (
          <TaskCard key={t.id} {...t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No tasks match your filters.</span>
        </div>
      )}
    </div>
  );
}

