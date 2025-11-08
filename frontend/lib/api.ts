const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  managerPhoto?: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  priority?: "Low" | "Medium" | "High" | "Critical";
  progress: number;
  coverImage?: string;
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
  managerPhoto?: string;
  coverImage?: string;
  due: string;
  priority: "Low" | "Medium" | "High" | "Critical";
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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API Request: ${options?.method || 'GET'} ${url}`);
  console.log(`📤 Request headers:`, headers);
  if (options?.body) {
    console.log(`📤 Request body:`, options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ API Error Response:`, errorBody);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      console.log(`✅ 204 No Content - returning null`);
      return null as T;
    }

    const data = await response.json();
    console.log(`✅ API Success Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Fetch error:`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  signin: async (credentials: {username:string, password:string}) => {
    const response = await fetchAPI<{token: string, username: string, email?: string, role: string}>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  },
  signup: (userInfo: {username:string, email:string, password:string, role?: string}) =>
    fetchAPI<{message: string}>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    }),
  getCurrentUser: () =>
    fetchAPI<{id: number, username: string, email: string, role: string}>('/auth/me'),
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
