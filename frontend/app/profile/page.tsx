"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, Save, RotateCcw, CheckCircle2, Camera, Briefcase, Calendar, Clock, BarChart2, Check, List } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username || "Anonymous");
  const [email, setEmail] = useState(user?.email || "no-email@oneflow.com");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setMsg("Profile updated successfully!");
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }, 800);
  }

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Success Message */}
        {msg && (
          <div className="bg-[#F0FDF4] border border-[#22C55E] rounded-lg p-4 flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
            <span className="text-[#166534] font-medium">{msg}</span>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E2E8F0]">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-4xl font-bold shadow-md">
                  {getInitials(name)}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md border-2 border-[#2563EB] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                  <Camera className="w-4 h-4 text-[#2563EB]" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-[#1E293B]">{name}</h2>
                <p className="text-[#64748B]">{email}</p>
                <div className="flex justify-center sm:justify-start gap-2 mt-2">
                  <span className="badge badge-lg bg-[#EFF6FF] text-[#2563EB] border-none font-medium py-3 px-4">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {user?.role?.replace('_', ' ') || 'Team Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={onSave} className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name Field */}
                <div className="form-control">
                  <label htmlFor="name" className="label">
                    <span className="label-text font-medium flex items-center gap-2 text-[#1E293B]">
                      <User className="w-4 h-4 text-[#64748B]" />
                      Full Name
                    </span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text font-medium flex items-center gap-2 text-[#1E293B]">
                      <Mail className="w-4 h-4 text-[#64748B]" />
                      Email Address
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label htmlFor="pwd" className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-[#1E293B]">
                    <Lock className="w-4 h-4 text-[#64748B]" />
                    Change Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="pwd"
                    type={showPassword ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="input input-bordered w-full pr-12 bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    placeholder="Leave blank to keep current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center text-[#64748B] hover:text-[#1E293B]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E2E8F0] mt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setPwd(""); setMsg(null); setShowPassword(false); }}
                  className="btn btn-ghost w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] p-6">
            <h3 className="font-bold text-lg text-[#1E293B] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              Account Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Member Since</span>
                <span className="font-medium text-[#1E293B]">January 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Last Login</span>
                <span className="font-medium text-[#1E293B]">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Account Status</span>
                <span className="font-medium text-[#16A34A] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] p-6">
            <h3 className="font-bold text-lg text-[#1E293B] mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#2563EB]" />
              Quick Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1"><List className="w-4 h-4" /> Projects Assigned</span>
                <span className="font-bold text-xl text-[#2563EB]">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1"><Check className="w-4 h-4" /> Tasks Completed</span>
                <span className="font-bold text-xl text-[#16A34A]">48</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1"><Clock className="w-4 h-4" /> Active Tasks</span>
                <span className="font-bold text-xl text-[#F59E0B]">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}