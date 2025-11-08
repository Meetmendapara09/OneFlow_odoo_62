"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home } from "lucide-react";

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
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="text-lg font-bold tracking-tight text-primary flex items-center gap-2"
        >
          <Image
            src="/image.png"
            alt="OneFlow"
            width={40}
            height={40}
            className="h-25 w-auto object-contain"
            priority
          />
          <span className="hidden sm:inline">OneFlow Portal</span>
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
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <Link href="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
              
              {/* Financial Dropdown */}
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  Financial
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-56 mt-2 border border-base-300">
                  <li className="menu-title"><span className="text-xs">Revenue</span></li>
                  <li><Link href="/sales-orders">🛒 Sales Orders</Link></li>
                  <li><Link href="/invoices">📄 Customer Invoices</Link></li>
                  <div className="divider my-1"></div>
                  <li className="menu-title"><span className="text-xs">Costs</span></li>
                  <li><Link href="/purchase-orders">📦 Purchase Orders</Link></li>
                  <li><Link href="/vendor-bills">🧾 Vendor Bills</Link></li>
                  <li><Link href="/expenses">💰 Expenses</Link></li>
                  <div className="divider my-1"></div>
                  <li className="menu-title"><span className="text-xs">Time</span></li>
                  <li><Link href="/timesheets">⏱️ Timesheets</Link></li>
                </ul>
              </div>
              
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

