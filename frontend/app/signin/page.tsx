"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";

interface Errors { username?: string; password?: string; }

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate() {
    const next: Errors = {};
    if (!username) next.username = "Username required";
    if (!password) next.password = "Password required";
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
      // Save auth data using context with role
      login(response.token, response.username, response.role as any, response.email);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Sign In" subtitle="Access your account">
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
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />
        {serverError && (
          <div className="alert alert-error py-2 text-sm">
            <span>{serverError}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <Link href="/forgot" className="link link-primary">Forgot password?</Link>
          <Link href="/signup" className="link">Create account</Link>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}