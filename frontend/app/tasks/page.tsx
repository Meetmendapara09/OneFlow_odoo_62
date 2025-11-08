"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import { taskAPI, type Task } from "@/lib/api";

type HistoryAction = {
  type: 'create' | 'update' | 'delete';
  task: Task;
  previousTask?: Task;
  timestamp: number;
};

const STATES: Task["state"][] = ["New", "In Progress", "Done"];
const PRIORITIES: Task["priority"][] = ["Low", "Medium", "High"];

const PROJECTS = [
  { id: "p1", name: "Student Portal Revamp" },
  { id: "p2", name: "HRMS Integration" },
  { id: "p3", name: "Finance Workflows" },
  { id: "p4", name: "AI Pilot" },
  { id: "p5", name: "Campus IoT Network" },
  { id: "p6", name: "Library Management System" },
];

const TEAM_MEMBERS = ["Jane", "Raj", "Sara", "Neil", "V. Mehta", "K. Desai"];

function TasksContent() {
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"All" | Task["state"]>("All");
  const [mineOnly, setMineOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignee: "Jane",
    due: "",
    priority: "Medium" as Task["priority"],
    state: "New" as Task["state"],
    tags: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    projectId: "",
    due: "",
  });

  // Load tasks from backend on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const data = await taskAPI.list();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setApiError('Failed to load tasks from server');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Handle edit query parameter on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const editId = searchParams.get('edit');
    if (editId) {
      const taskToEdit = tasks.find(t => t.id === editId);
      if (taskToEdit) {
        hasInitialized.current = true;
        queueMicrotask(() => {
          setEditingTask(taskToEdit);
          setFormData({
            title: taskToEdit.title,
            description: taskToEdit.description || "",
            projectId: taskToEdit.projectId || "",
            assignee: taskToEdit.assignee,
            due: taskToEdit.due,
            priority: taskToEdit.priority,
            state: taskToEdit.state,
            tags: taskToEdit.tags?.join(", ") || "",
          });
          setShowModal(true);
        });
      }
    }
  }, [searchParams, tasks]);

  const filtered = useMemo(() => {
    const me = "Jane"; // placeholder: current user
    return tasks.filter(t =>
      (state === "All" || t.state === state) &&
      (query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase())) &&
      (!mineOnly || t.assignee === me)
    );
  }, [tasks, query, state, mineOnly]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.state === "In Progress").length;
    const done = tasks.filter(t => t.state === "Done").length;
    const newTasks = tasks.filter(t => t.state === "New").length;
    const myTasks = tasks.filter(t => t.assignee === "Jane").length; // placeholder
    return { total, inProgress, done, newTasks, myTasks };
  }, [tasks]);

  // Auto-save, unsaved changes tracking, keyboard shortcuts, validation, history - same pattern as projects
  useEffect(() => {
    if (showModal && (formData.title || formData.description)) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        const draftKey = editingTask ? `task-draft-${editingTask.id}` : 'task-draft-new';
        localStorage.setItem(draftKey, JSON.stringify(formData));
      }, 2000);
    }
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [formData, showModal, editingTask]);

  useEffect(() => {
    queueMicrotask(() => {
      if (editingTask) {
        const hasChanges = formData.title !== editingTask.title ||
          formData.description !== (editingTask.description || "") ||
          formData.projectId !== (editingTask.projectId || "") ||
          formData.assignee !== editingTask.assignee ||
          formData.due !== editingTask.due ||
          formData.priority !== editingTask.priority ||
          formData.state !== editingTask.state ||
          formData.tags !== (editingTask.tags?.join(", ") || "");
        setHasUnsavedChanges(hasChanges);
      } else {
        setHasUnsavedChanges(formData.title.trim() !== "" || formData.description.trim() !== "");
      }
    });
  }, [formData, editingTask]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showModal) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.querySelector('form')?.requestSubmit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (hasUnsavedChanges) setShowUnsavedWarning(true);
        else {
          setShowModal(false);
          setEditingTask(null);
          setHasUnsavedChanges(false);
          setFormData({ title: "", description: "", projectId: "", assignee: "Jane", due: "", priority: "Medium", state: "New", tags: "" });
          setErrors({ title: "", description: "", projectId: "", due: "" });
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, hasUnsavedChanges]);

  const validateForm = (): boolean => {
    const newErrors = { title: "", description: "", projectId: "", due: "" };
    let isValid = true;
    if (!formData.title.trim()) { newErrors.title = "Task title is required"; isValid = false; }
    else if (formData.title.trim().length < 3) { newErrors.title = "Title must be at least 3 characters"; isValid = false; }
    if (!formData.description.trim()) { newErrors.description = "Description is required"; isValid = false; }
    if (!formData.projectId) { newErrors.projectId = "Please select a project"; isValid = false; }
    if (!formData.due) { newErrors.due = "Due date is required"; isValid = false; }
    else if (new Date(formData.due) < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.due = "Due date cannot be in the past"; isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const addToHistory = useCallback((action: HistoryAction) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(action);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return;
    const action = history[historyIndex];
    if (action.type === 'create') setTasks(prev => prev.filter(t => t.id !== action.task.id));
    else if (action.type === 'update' && action.previousTask) setTasks(prev => prev.map(t => t.id === action.previousTask!.id ? action.previousTask! : t));
    else if (action.type === 'delete') setTasks(prev => [...prev, action.task]);
    setHistoryIndex(prev => prev - 1);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const action = history[historyIndex + 1];
    if (action.type === 'create') setTasks(prev => [...prev, action.task]);
    else if (action.type === 'update') setTasks(prev => prev.map(t => t.id === action.task.id ? action.task : t));
    else if (action.type === 'delete') setTasks(prev => prev.filter(t => t.id !== action.task.id));
    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); handleRedo(); }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleUndo, handleRedo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const selectedProject = PROJECTS.find(p => p.id === formData.projectId);
    if (!selectedProject) return;

    try {
      if (editingTask) {
        // Update existing task via API
        const updatedTask = await taskAPI.update(editingTask.id, {
          ...editingTask,
          title: formData.title,
          description: formData.description,
          project: selectedProject.name,
          projectId: formData.projectId,
          assignee: formData.assignee,
          due: formData.due,
          priority: formData.priority,
          state: formData.state,
          tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
        });
        
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        addToHistory({ type: 'update', task: updatedTask, previousTask: editingTask, timestamp: Date.now() });
      } else {
        // Create new task via API
        const newTask = await taskAPI.create({
          title: formData.title,
          description: formData.description,
          project: selectedProject.name,
          projectId: formData.projectId,
          assignee: formData.assignee,
          due: formData.due,
          priority: formData.priority,
          state: formData.state,
          tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
          subtaskProgress: { completed: 0, total: 0 },
        });
        
        setTasks([...tasks, newTask]);
        addToHistory({ type: 'create', task: newTask, timestamp: Date.now() });
      }

      // Clear draft from localStorage
      const draftKey = editingTask ? `task-draft-${editingTask.id}` : 'task-draft-new';
      localStorage.removeItem(draftKey);
      
      setShowModal(false);
      setEditingTask(null);
      setHasUnsavedChanges(false);
      setFormData({ title: "", description: "", projectId: "", assignee: "Jane", due: "", priority: "Medium", state: "New", tags: "" });
      setErrors({ title: "", description: "", projectId: "", due: "" });
    } catch (error) {
      console.error('Failed to save task:', error);
      setApiError('Failed to save task. Please try again.');
      alert('Failed to save task. Please try again.');
    }
  };

  const handleEdit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      const draftKey = `task-draft-${taskId}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try { setFormData(JSON.parse(savedDraft)); }
        catch { setFormData({ title: task.title, description: task.description || "", projectId: task.projectId || "", assignee: task.assignee, due: task.due, priority: task.priority, state: task.state, tags: task.tags?.join(", ") || "" }); }
      } else {
        setFormData({ title: task.title, description: task.description || "", projectId: task.projectId || "", assignee: task.assignee, due: task.due, priority: task.priority, state: task.state, tags: task.tags?.join(", ") || "" });
      }
      setShowModal(true);
    }
  };

  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const task = tasks.find(t => t.id === taskToDelete);
      if (task) {
        try {
          // Delete from backend
          await taskAPI.delete(taskToDelete);
          
          // Update local state
          setTasks(tasks.filter(t => t.id !== taskToDelete));
          addToHistory({ type: 'delete', task: task, timestamp: Date.now() });
        } catch (error) {
          console.error('Failed to delete task:', error);
          alert('Failed to delete task. Please try again.');
        }
      }
    }
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setShowModal(false);
      setEditingTask(null);
      setHasUnsavedChanges(false);
      setFormData({ title: "", description: "", projectId: "", assignee: "Jane", due: "", priority: "Medium", state: "New", tags: "" });
      setErrors({ title: "", description: "", projectId: "", due: "" });
    }
  };

  const confirmCloseModal = () => {
    const draftKey = editingTask ? `task-draft-${editingTask.id}` : 'task-draft-new';
    localStorage.removeItem(draftKey);
    setShowModal(false);
    setEditingTask(null);
    setHasUnsavedChanges(false);
    setShowUnsavedWarning(false);
    setFormData({ title: "", description: "", projectId: "", assignee: "Jane", due: "", priority: "Medium", state: "New", tags: "" });
    setErrors({ title: "", description: "", projectId: "", due: "" });
  };

  const cancelCloseModal = () => {
    setShowUnsavedWarning(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Show error state
  if (apiError) {
    return (
      <div className="space-y-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{apiError}</span>
          <button className="btn btn-sm" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={handleUndo}
            disabled={historyIndex < 0}
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            New Task
          </button>
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
          <div className="stat-title">New</div>
          <div className="stat-value text-warning">{stats.newTasks}</div>
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
          <TaskCard key={t.id} {...t} onEdit={handleEdit} onDelete={handleDelete} />
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

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-2xl">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-ghost btn-sm"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div className="form-control">
                    <label className="label">Task Title *</label>
                    <input
                      type="text"
                      name="title"
                      className={`input ${errors.title ? 'input-error' : ''}`}
                      placeholder="Enter task title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.title && <span className="text-error text-sm mt-1">{errors.title}</span>}
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">Description</label>
                    <textarea
                      name="description"
                      className={`input min-h-[100px] py-2 ${errors.description ? 'input-error' : ''}`}
                      placeholder="Enter task description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
                  </div>

                  {/* Project and Assignee Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">Project *</label>
                      <select
                        name="projectId"
                        className={`input ${errors.projectId ? 'input-error' : ''}`}
                        value={formData.projectId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select project</option>
                        {PROJECTS.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {errors.projectId && <span className="text-error text-sm mt-1">{errors.projectId}</span>}
                    </div>

                    <div className="form-control">
                      <label className="label">Assignee *</label>
                      <select
                        name="assignee"
                        className="input"
                        value={formData.assignee}
                        onChange={handleInputChange}
                        required
                      >
                        {TEAM_MEMBERS.map(member => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Priority, State, and Due Date Row */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">Priority *</label>
                      <select
                        name="priority"
                        className="input"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                      >
                        {PRIORITIES.map(p => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">Status *</label>
                      <select
                        name="state"
                        className="input"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      >
                        {STATES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">Due Date *</label>
                      <input
                        type="date"
                        name="due"
                        className={`input ${errors.due ? 'input-error' : ''}`}
                        value={formData.due}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.due && <span className="text-error text-sm mt-1">{errors.due}</span>}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="form-control">
                    <label className="label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      className="input"
                      placeholder="e.g., frontend, urgent, bug"
                      value={formData.tags}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-muted mt-1">
                      Separate multiple tags with commas
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-6 pt-4 border-t border-base-300">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelDelete} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Unsaved Changes</h3>
            <p className="mb-6">You have unsaved changes. Are you sure you want to close without saving?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelCloseModal} className="btn btn-ghost">
                Keep Editing
              </button>
              <button onClick={confirmCloseModal} className="btn btn-warning">
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <TasksContent />
    </Suspense>
  );
}

