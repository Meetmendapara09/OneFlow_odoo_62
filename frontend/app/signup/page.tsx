"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import { authAPI } from "@/lib/api";

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("TEAM_MEMBER");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Errors = {};

    if (!username) next.username = "Username is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "At least 8 characters";
    if (!confirm) next.confirm = "Confirm your password";
    else if (confirm !== password) next.confirm = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("✅ handleSubmit called");
    console.log("📝 Form data:", { username, email, password: "***" });

    setServerError(null);

    if (!validate()) {
      console.log("❌ Validation failed:", errors);
      return;
    }

    console.log("✅ Validation passed, calling API...");
    setSubmitting(true);

    try {
      console.log("🔄 Calling authAPI.signup...");
      const response = await authAPI.signup({ username, email, password, role });
      console.log("✅ Signup API response:", response);
      console.log("🎉 Signup successful! Redirecting to signin...");

      // Show success message before redirecting
      alert("Account created successfully! Please sign in.");
      router.push("/signin");
    } catch (err) {
      console.error("❌ Signup error:", err);
      console.error("❌ Error details:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined
      });
      const message = err instanceof Error ? err.message : "Sign up failed";
      setServerError(message);
    } finally {
      console.log("🏁 Signup process completed, submitting:", false);
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Join the OneFlow Portal">
      {/* ✅ Only form in the component tree */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="username"
          type="text"
          label="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          placeholder="your_username"
        />

        <FormField
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />

        <FormField
          id="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="At least 8 characters"
        />

        <FormField
          id="confirm"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          placeholder="Repeat your password"
        />

        <div className="form-control">
          <label htmlFor="role" className="label">
            <span className="label-text font-medium">Role</span>
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="TEAM_MEMBER">Team Member</option>
            <option value="PROJECT_MANAGER">Project Manager</option>
            <option value="SALES_FINANCE">Sales/Finance</option>
            <option value="SUPERADMIN">Super Admin</option>
          </select>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Select your role in the organization
            </span>
          </label>
        </div>

        {serverError && (
          <div className="alert alert-error py-2 text-sm">
            <span>{serverError}</span>
          </div>
        )}

        <div className="text-xs text-center">
          Already have an account?{" "}
          <Link href="/signin" className="link link-primary">
            Sign in
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
}
