"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, loading, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-base-300 bg-base-100/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container py-3 flex items-center justify-between">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          OneFlow Portal
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {loading ? (
            // Show skeleton/loading state while checking auth
            <div className="flex items-center gap-6">
              <div className="skeleton h-4 w-16"></div>
              <div className="skeleton h-4 w-16"></div>
              <div className="skeleton h-8 w-20 rounded-full"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <Link href="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
              <Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
              <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>

              {/* User dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-8">
                      <span className="text-xs">{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="hidden sm:inline">{user?.username}</span>
                  <span className="badge badge-sm badge-secondary">{user?.role?.replace('_', ' ')}</span>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2 border border-base-300">
                  <li className="menu-title">
                    <span className="text-xs">Signed in as</span>
                    <span className="font-semibold truncate">{user?.username}</span>
                    <span className="badge badge-sm badge-secondary mt-1">{user?.role?.replace('_', ' ')}</span>
                  </li>
                  <li><Link href="/profile">👤 Profile</Link></li>
                  <li><Link href="/dashboard">📊 Dashboard</Link></li>
                  {isAdmin() && (
                    <>
                      <div className="divider my-0"></div>
                      <li className="menu-title"><span className="text-xs">Admin</span></li>
                      <li><Link href="/admin/users">👥 Manage Users</Link></li>
                      <li><Link href="/admin/settings">⚙️ Settings</Link></li>
                    </>
                  )}
                  <div className="divider my-0"></div>
                  <li><button onClick={handleLogout} className="text-error">🚪 Sign Out</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="/#about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/signin" className="btn btn-primary btn-sm">Sign In</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

