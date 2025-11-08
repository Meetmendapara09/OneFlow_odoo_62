"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface Errors {
  username?: string;
  password?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate() {
    const next: Errors = {};
    if (!username) next.username = "Username is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await authAPI.signin({ username, password });
      login(response.token, response.username, response.role as "TEAM_MEMBER" | "PROJECT_MANAGER" | "SALES_FINANCE" | "SUPERADMIN", response.email);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/image.png"
              alt="OneFlow Logo"
              width={40}
              height={40}
              className="h-25 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-[#1E293B]">
              OneFlow
            </span>
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <p className="text-lg text-[#64748B]">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username Field */}
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#64748B]" />
                  Username
                </span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`input input-bordered w-full transition-all bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                  errors.username ? 'input-error' : ''
                }`}
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.username}</span>
                </label>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#64748B]" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pr-12 transition-all bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                    errors.password ? 'input-error' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-[#64748B] hover:text-[#1E293B]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password}</span>
                </label>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link href="/forgot" className="text-sm text-[#2563EB] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full text-base h-12"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-[#64748B]">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-[#2563EB] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#64748B]">
          <p>&copy; {new Date().getFullYear()} OneFlow. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}