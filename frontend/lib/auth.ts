// Auth utility functions for managing user authentication
export type UserRole = 'SUPERADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'SALES_FINANCE';

export interface AuthUser {
  username: string;
  email?: string;
  role: UserRole;
}

export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // Get current user info from token
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role') as UserRole;

    if (!token || !username || !role) return null;

    return {
      username,
      email: email || undefined,
      role,
    };
  },

  // Save user info after login
  saveAuthData: (token: string, username: string, role: UserRole, email?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    if (email) {
      localStorage.setItem('email', email);
    }
  },

  // Clear auth data on logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  },

  // Check if user has specific role
  hasRole: (role: UserRole): boolean => {
    const currentUser = authUtils.getCurrentUser();
    return currentUser?.role === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles: UserRole[]): boolean => {
    const currentUser = authUtils.getCurrentUser();
    return currentUser ? roles.includes(currentUser.role) : false;
  },

  // Check if user is admin (superadmin or project manager)
  isAdmin: (): boolean => {
    return authUtils.hasAnyRole(['SUPERADMIN', 'PROJECT_MANAGER']);
  },
};

