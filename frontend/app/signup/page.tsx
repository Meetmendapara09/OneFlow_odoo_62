"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Briefcase } from "lucide-react";
import Image from "next/image";

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("TEAM_MEMBER");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Errors = {};

    if (!username) next.username = "Username is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Invalid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (!confirm) next.confirm = "Please confirm your password";
    else if (confirm !== password) next.confirm = "Passwords do not match";
    if (!acceptedTerms) next.terms = "You must accept the Terms and Conditions";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await authAPI.signup({ username, email, password, role });
      alert("Account created successfully! Please sign in.");
      router.push("/signin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-lg">
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

        {/* Sign Up Card */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <p className="text-lg text-[#64748B]">Join OneFlow to streamline your project management.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username Field */}
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#64748B]" />
                  Username
                </span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                className={`input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                  errors.username ? 'input-error' : ''
                }`}
              />
              {errors.username && <span className="text-error text-xs mt-1">{errors.username}</span>}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#64748B]" />
                  Email Address
                </span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={`input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                  errors.email ? 'input-error' : ''
                }`}
              />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`input input-bordered w-full pr-10 bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                      errors.password ? 'input-error' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center text-[#64748B] hover:text-[#1E293B]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label htmlFor="confirm" className="label">
                  <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#64748B]" />
                    Confirm Password
                  </span>
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={`input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                    errors.confirm ? 'input-error' : ''
                  }`}
                />
                {errors.confirm && <span className="text-error text-xs mt-1">{errors.confirm}</span>}
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-control">
              <label htmlFor="role" className="label">
                <span className="label-text font-medium text-[#1E293B] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#64748B]" />
                  Your Role
                </span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select select-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="TEAM_MEMBER">👤 Team Member</option>
                <option value="PROJECT_MANAGER">🧑‍💼 Project Manager</option>
                <option value="SALES_FINANCE">💰 Sales / Finance</option>
                <option value="SUPERADMIN">⚡ Super Admin</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className={`checkbox checkbox-primary ${errors.terms ? 'checkbox-error' : ''}`}
                />
                <span className="label-text text-[#64748B]">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-[#2563EB] hover:underline font-medium">
                    Terms and Conditions
                  </Link>
                </span>
              </label>
              {errors.terms && <span className="text-error text-xs mt-1 ml-8">{errors.terms}</span>}
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
                  Creating Account...
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-[#64748B]">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-[#2563EB] hover:underline">
                Sign In
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
