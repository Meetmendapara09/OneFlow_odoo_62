"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { projectAPI, type Project } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type HistoryAction = {
  type: 'create' | 'update' | 'delete';
  project: Project;
  previousProject?: Project;
  timestamp: number;
};

const STATUSES: Project["status"][] = ["Planned", "In Progress", "Completed", "On Hold"];
const MANAGERS = ["A. Patel", "R. Singh", "S. Kumar", "N. Shah", "V. Mehta", "K. Desai"];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const { hasAnyRole } = useAuth();
  const hasInitialized = useRef(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | Project["status"]>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "A. Patel",
    status: "Planned" as Project["status"],
    deadline: "",
    teamSize: 1,
    progress: 0,
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    deadline: "",
    teamSize: "",
  });

  // Load projects from backend on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const data = await projectAPI.list();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setApiError('Failed to load projects from server');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Handle edit query parameter on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const editId = searchParams.get('edit');
    if (editId) {
      const projectToEdit = projects.find(p => p.id === editId);
      if (projectToEdit) {
        hasInitialized.current = true;
        // Defer state updates to avoid React 19 warning
        queueMicrotask(() => {
          setEditingProject(projectToEdit);
          setFormData({
            name: projectToEdit.name,
            description: projectToEdit.description || "",
            manager: projectToEdit.manager,
            status: projectToEdit.status,
            deadline: projectToEdit.deadline,
            teamSize: projectToEdit.teamSize || 1,
            progress: projectToEdit.progress || 0,
          });
          setShowModal(true);
        });
      }
    }
  }, [searchParams, projects]);

  const filtered = useMemo(() => {
    return projects.filter(p =>
      (status === "All" || p.status === status) &&
      (query.trim() === "" || p.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [projects, query, status]);

  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === "In Progress").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const planned = projects.filter(p => p.status === "Planned").length;
    return { total, inProgress, completed, planned };
  }, [projects]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (showModal && (formData.name || formData.description)) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        const draftKey = editingProject ? `project-draft-${editingProject.id}` : 'project-draft-new';
        localStorage.setItem(draftKey, JSON.stringify(formData));
        
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, showModal, editingProject]);

  // Track unsaved changes
  useEffect(() => {
    queueMicrotask(() => {
      if (editingProject) {
        const hasChanges = 
          formData.name !== editingProject.name ||
          formData.description !== editingProject.description ||
          formData.manager !== editingProject.manager ||
          formData.status !== editingProject.status ||
          formData.deadline !== editingProject.deadline ||
          formData.teamSize !== (editingProject.teamSize || 1) ||
          formData.progress !== (editingProject.progress || 0);
        setHasUnsavedChanges(hasChanges);
      } else {
        const hasChanges = formData.name.trim() !== "" || formData.description.trim() !== "";
        setHasUnsavedChanges(hasChanges);
      }
    });
  }, [formData, editingProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showModal) return;

      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }

      // Esc to close
      if (e.key === 'Escape') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          setShowUnsavedWarning(true);
        } else {
          setShowModal(false);
          setEditingProject(null);
          setHasUnsavedChanges(false);
          setFormData({
            name: "",
            description: "",
            manager: "A. Patel",
            status: "Planned",
            deadline: "",
            teamSize: 1,
            progress: 0,
          });
          setErrors({
            name: "",
            description: "",
            deadline: "",
            teamSize: "",
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, hasUnsavedChanges]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      description: "",
      deadline: "",
      teamSize: "",
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
      isValid = false;
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
        isValid = false;
      }
    }

    // Team size validation
    if (formData.teamSize < 1) {
      newErrors.teamSize = "Team size must be at least 1";
      isValid = false;
    } else if (formData.teamSize > 100) {
      newErrors.teamSize = "Team size cannot exceed 100";
      isValid = false;
    }

    setErrors(newErrors);
    
    return isValid;
  };

  // Add to history
  const addToHistory = useCallback((action: HistoryAction) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(action);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return;

    const action = history[historyIndex];
    
    if (action.type === 'create') {
      setProjects(prev => prev.filter(p => p.id !== action.project.id));
    } else if (action.type === 'update' && action.previousProject) {
      setProjects(prev => prev.map(p => 
        p.id === action.previousProject!.id ? action.previousProject! : p
      ));
    } else if (action.type === 'delete') {
      setProjects(prev => [...prev, action.project]);
    }

    setHistoryIndex(prev => prev - 1);
  }, [history, historyIndex]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const action = history[historyIndex + 1];
    
    if (action.type === 'create') {
      setProjects(prev => [...prev, action.project]);
    } else if (action.type === 'update') {
      setProjects(prev => prev.map(p => 
        p.id === action.project.id ? action.project : p
      ));
    } else if (action.type === 'delete') {
      setProjects(prev => prev.filter(p => p.id !== action.project.id));
    }

    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  // Global keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleUndo, handleRedo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      if (editingProject) {
        // Update existing project via API
        const updatedProject = await projectAPI.update(editingProject.id, {
          ...editingProject,
          name: formData.name,
          description: formData.description,
          manager: formData.manager,
          status: formData.status,
          deadline: formData.deadline,
          teamSize: formData.teamSize,
          progress: formData.progress,
        });

        setProjects(projects.map(p => 
          p.id === editingProject.id ? updatedProject : p
        ));

        // Add to history
        addToHistory({
          type: 'update',
          project: updatedProject,
          previousProject: editingProject,
          timestamp: Date.now(),
        });
      } else {
        // Create new project via API
        const newProject = await projectAPI.create({
          name: formData.name,
          description: formData.description,
          manager: formData.manager,
          status: formData.status,
          progress: 0,
          deadline: formData.deadline,
          teamSize: formData.teamSize,
          tasksCompleted: 0,
          totalTasks: 0,
        });
        
        setProjects([...projects, newProject]);

        // Add to history
        addToHistory({
          type: 'create',
          project: newProject,
          timestamp: Date.now(),
        });
      }

      // Clear draft from localStorage
      const draftKey = editingProject ? `project-draft-${editingProject.id}` : 'project-draft-new';
      localStorage.removeItem(draftKey);

      setShowModal(false);
      setEditingProject(null);
      setHasUnsavedChanges(false);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        manager: "A. Patel",
        status: "Planned",
        deadline: "",
        teamSize: 1,
        progress: 0,
      });

      // Reset errors
      setErrors({
        name: "",
        description: "",
        deadline: "",
        teamSize: "",
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      setApiError('Failed to save project. Please try again.');
      // Show error to user - you could add a toast notification here
      alert('Failed to save project. Please try again.');
    }
  };

  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(project);
      
      // Check for draft in localStorage
      const draftKey = `project-draft-${projectId}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setFormData(draft);
        } catch {
          // If draft is corrupted, use original project data
          setFormData({
            name: project.name,
            description: project.description,
            manager: project.manager,
            status: project.status,
            deadline: project.deadline,
            teamSize: project.teamSize || 1,
            progress: project.progress,
          });
        }
      } else {
        setFormData({
          name: project.name,
          description: project.description,
          manager: project.manager,
          status: project.status,
          deadline: project.deadline,
          teamSize: project.teamSize || 1,
          progress: project.progress,
        });
      }
      
      setShowModal(true);
    }
  };

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      const project = projects.find(p => p.id === projectToDelete);
      if (project) {
        try {
          // Delete from backend
          await projectAPI.delete(projectToDelete);
          
          // Update local state
          setProjects(projects.filter(p => p.id !== projectToDelete));
          
          // Add to history
          addToHistory({
            type: 'delete',
            project: project,
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error('Failed to delete project:', error);
          alert('Failed to delete project. Please try again.');
        }
      }
    }
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setShowModal(false);
      setEditingProject(null);
      setHasUnsavedChanges(false);
      setFormData({
        name: "",
        description: "",
        manager: "A. Patel",
        status: "Planned",
        deadline: "",
        teamSize: 1,
        progress: 0,
      });
      setErrors({
        name: "",
        description: "",
        deadline: "",
        teamSize: "",
      });
    }
  };

  const confirmCloseModal = () => {
    const draftKey = editingProject ? `project-draft-${editingProject.id}` : 'project-draft-new';
    localStorage.removeItem(draftKey);
    
    setShowModal(false);
    setEditingProject(null);
    setHasUnsavedChanges(false);
    setShowUnsavedWarning(false);
    setFormData({
      name: "",
      description: "",
      manager: "A. Patel",
      status: "Planned",
      deadline: "",
      teamSize: 1,
      progress: 0,
    });
    setErrors({
      name: "",
      description: "",
      deadline: "",
      teamSize: "",
    });
  };

  const cancelCloseModal = () => {
    setShowUnsavedWarning(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "teamSize" || name === "progress" ? parseInt(value) || 0 : value 
    }));
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
    <div className="space-y-6 bg-[#F8FAFC] p-2 md:p-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
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
          <input
            type="text"
            placeholder="Search projects"
            className="input input-bordered w-48"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {hasAnyRole(['PROJECT_MANAGER', 'SUPERADMIN']) && (
            <button 
              className="btn btn-primary gap-2" 
              onClick={() => setShowModal(true)}
              title="Create Project (Project Manager only)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Project
            </button>
          )}
        </div>
      </div>
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[{
          label: 'Total Projects', value: stats.total, sub: `${stats.inProgress} active`
        }, {
          label: 'In Progress', value: stats.inProgress, sub: `${stats.completed} completed`
        }, {
          label: 'Completed', value: stats.completed, sub: `${stats.planned} planned`
        }, {
          label: 'Planned', value: stats.planned, sub: 'Upcoming pipeline'
        }].map((m, i) => (
          <div key={i} className="card bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body p-4">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-[#64748B]">{m.label}</h3>
              <p className="text-3xl font-bold text-[#2563EB] mt-1">{m.value}</p>
              <p className="text-xs text-[#64748B] mt-1">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`btn btn-sm ${status === 'All' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatus('All')}
        >All</button>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatus(s)}
          >{s}</button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <ProjectCard key={p.id} {...p} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="alert bg-[#EFF6FF] border border-[#2563EB]/20 text-[#1E293B]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">No projects match your filters.</span>
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E2E8F0] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#1E293B]">
                    {editingProject ? "Edit Project" : "Create New Project"}
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
                  {/* Project Name */}
                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Project Name *</label>
                    <input
                      type="text"
                      name="name"
                      className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label text-sm font-medium text-[#1E293B]">Description *</label>
                    <textarea
                      name="description"
                      className={`textarea textarea-bordered min-h-[120px] ${errors.description ? 'textarea-error' : ''}`}
                      placeholder="Enter project description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
                  </div>

                  {/* Manager and Status Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium text-[#1E293B]">Project Manager *</label>
                      <select
                        name="manager"
                        className="select select-bordered"
                        value={formData.manager}
                        onChange={handleInputChange}
                        required
                      >
                        {MANAGERS.map(m => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium text-[#1E293B]">Status *</label>
                      <select
                        name="status"
                        className="select select-bordered"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Deadline and Team Size Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium text-[#1E293B]">Deadline *</label>
                      <input
                        type="date"
                        name="deadline"
                        className={`input input-bordered ${errors.deadline ? 'input-error' : ''}`}
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.deadline && <span className="text-error text-sm mt-1">{errors.deadline}</span>}
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium text-[#1E293B]">Team Size</label>
                      <input
                        type="number"
                        name="teamSize"
                        className={`input input-bordered ${errors.teamSize ? 'input-error' : ''}`}
                        placeholder="Number of team members"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                      />
                      {errors.teamSize && <span className="text-error text-sm mt-1">{errors.teamSize}</span>}
                    </div>
                  </div>

                  {/* Progress (only show when editing) */}
                  {editingProject && (
                    <div className="form-control">
                      <label className="label text-sm font-medium text-[#1E293B]">Progress (%)</label>
                      <input
                        type="number"
                        name="progress"
                        className="input input-bordered"
                        placeholder="Project progress"
                        value={formData.progress}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                      />
                      <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden mt-2">
                        <div className="h-full bg-[#2563EB] transition-all" style={{ width: `${formData.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-6 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E2E8F0] max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E2E8F0] max-w-md w-full p-6">
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}

