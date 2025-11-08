"use client";
import React, { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";

interface Errors { email?: string; password?: string; }

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate() {
    const next: Errors = {};
    if (!email) next.email = "Email required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Invalid email";
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
      // Placeholder: replace with real login API call when backend endpoint exists
      await new Promise(r => setTimeout(r, 500));
      // success: redirect or set state
      window.location.href = "/";
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