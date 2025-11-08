const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  deadline: string;
  teamSize?: number;
  tasksCompleted?: number;
  totalTasks?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  projectId: string;
  assignee: string;
  assigneeAvatar?: string;
  due: string;
  priority: "Low" | "Medium" | "High";
  state: "New" | "In Progress" | "Done";
  tags: string[];
  subtaskProgress?: {
    completed: number;
    total: number;
  };
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signin: (credentials: {username:string, password:string}) =>
    fetchAPI<string>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (userInfo: {username:string, email:string, password:string}) =>
    fetchAPI<{message: string}>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    }),
};

// Project API
export const projectAPI = {
  // Get all projects
  list: () => fetchAPI<Project[]>('/projects'),

  // Get single project
  get: (id: string) => fetchAPI<Project>(`/projects/${id}`),

  // Create new project
  create: (project: Omit<Project, 'id'>) =>
    fetchAPI<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),

  // Update existing project
  update: (id: string, project: Partial<Project>) =>
    fetchAPI<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...project, id }),
    }),

  // Delete project
  delete: (id: string) =>
    fetchAPI<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Task API
export const taskAPI = {
  // Get all tasks
  list: () => fetchAPI<Task[]>('/tasks'),

  // Get single task
  get: (id: string) => fetchAPI<Task>(`/tasks/${id}`),

  // Create new task
  create: (task: Omit<Task, 'id'>) =>
    fetchAPI<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  // Update existing task
  update: (id: string, task: Partial<Task>) =>
    fetchAPI<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...task, id }),
    }),

  // Delete task
  delete: (id: string) =>
    fetchAPI<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthCheck = () => fetchAPI<string>('/health');
