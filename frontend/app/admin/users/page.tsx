"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  hourlyRate?: number;
  createdAt?: string;
}

export default function ManageUsersPage() {
  const { user, hasAnyRole } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  // Debug: Log state changes
  useEffect(() => {
    console.log("Modal state changed - showEditModal:", showEditModal, "selectedUser:", selectedUser);
  }, [showEditModal, selectedUser]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER",
    hourlyRate: 50
  });

  useEffect(() => {
    if (!hasAnyRole(['SUPERADMIN'])) {
      router.push('/dashboard');
    }
  }, [hasAnyRole, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const mockUsers: User[] = [
        { id: 1, username: "super", email: "super@example.com", role: "SUPERADMIN", hourlyRate: 100, createdAt: "2025-01-01" },
        { id: 2, username: "john_manager", email: "john@example.com", role: "PROJECT_MANAGER", hourlyRate: 80, createdAt: "2025-02-15" },
        { id: 3, username: "jane_dev", email: "jane@example.com", role: "TEAM_MEMBER", hourlyRate: 50, createdAt: "2025-03-10" },
        { id: 4, username: "bob_sales", email: "bob@example.com", role: "SALES_FINANCE", hourlyRate: 70, createdAt: "2025-04-05" },
        { id: 5, username: "alice_dev", email: "alice@example.com", role: "TEAM_MEMBER", hourlyRate: 50, createdAt: "2025-05-20" },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser: User = {
        id: users.length + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        hourlyRate: formData.hourlyRate,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setFormData({ username: "", email: "", password: "", role: "TEAM_MEMBER", hourlyRate: 50 });
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      setShowEditModal(false);
      setSelectedUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "SUPERADMIN": return "badge-error";
      case "PROJECT_MANAGER": return "badge-primary";
      case "SALES_FINANCE": return "badge-warning";
      case "TEAM_MEMBER": return "badge-neutral";
      default: return "";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPERADMIN": return "🔑";
      case "PROJECT_MANAGER": return "👔";
      case "SALES_FINANCE": return "💰";
      case "TEAM_MEMBER": return "👤";
      default: return "👤";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted mt-1">View and manage all system users</p>
        </div>
        <div className="flex gap-2">
          {/* Test button for debugging */}
          <button
            onClick={() => {
              console.log("TEST: Opening edit modal for first user");
              setSelectedUser(users[0]);
              setShowEditModal(true);
            }}
            className="btn btn-outline btn-sm"
          >
            🔧 Test Edit
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{users.length}</div>
          <div className="stat-desc">All registered users</div>
        </div>
        <div className="stat">
          <div className="stat-title">Admins</div>
          <div className="stat-value metric-hours">{users.filter(u => u.role === 'SUPERADMIN').length}</div>
          <div className="stat-desc">System administrators</div>
        </div>
        <div className="stat">
          <div className="stat-title">Project Managers</div>
          <div className="stat-value metric-cost">{users.filter(u => u.role === 'PROJECT_MANAGER').length}</div>
          <div className="stat-desc">Managing projects</div>
        </div>
        <div className="stat">
          <div className="stat-title">Team Members</div>
          <div className="stat-value metric-profit">{users.filter(u => u.role === 'TEAM_MEMBER').length}</div>
          <div className="stat-desc">Active team members</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Search Users</span>
              </label>
              <input
                type="text"
                placeholder="Search by username or email..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="label">
                <span className="label-text">Filter by Role</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="SUPERADMIN">Super Admin</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="SALES_FINANCE">Sales/Finance</option>
                <option value="TEAM_MEMBER">Team Member</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Users ({filteredUsers.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Role</th>
                  <th className="text-left py-3 px-2">Hourly Rate</th>
                  <th className="text-left py-3 px-2">Joined</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-base-300 hover:bg-base-200">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span>{user.username.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          <div className="text-xs text-muted">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2">
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)} {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-semibold">${user.hourlyRate}/hr</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted">
                      {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            console.log("Edit clicked for user:", user);
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="btn btn-ghost btn-sm tooltip tooltip-left hover:bg-primary hover:text-primary-content"
                          data-tip="Edit user"
                          style={{ cursor: 'pointer' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {user.username !== 'super' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-ghost btn-sm text-error tooltip tooltip-left hover:bg-error hover:text-error-content"
                            data-tip="Delete user"
                            style={{ cursor: 'pointer' }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Add New User</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Username *</span></label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="input input-bordered"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Email *</span></label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="input input-bordered"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Password *</span></label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Role *</span></label>
                  <select
                    className="select select-bordered"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="SALES_FINANCE">Sales/Finance</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Hourly Rate ($)</span></label>
                  <input
                    type="number"
                    placeholder="50"
                    className="input input-bordered"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={!formData.username || !formData.email || !formData.password}
              >
                Add User
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Username</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Email</span></label>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Role</span></label>
                  <select
                    className="select select-bordered"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  >
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="SALES_FINANCE">Sales/Finance</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Hourly Rate ($)</span></label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={selectedUser.hourlyRate}
                    onChange={(e) => setSelectedUser({...selectedUser, hourlyRate: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditUser}>
                Save Changes
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
        </div>
      )}
    </div>
  );
}

