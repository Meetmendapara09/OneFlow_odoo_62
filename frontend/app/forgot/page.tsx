"use client";
import React, { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";

interface Errors { email?: string; }

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!email) next.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Invalid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
  }

  return (
    <AuthCard title="Reset password" subtitle="We'll email you a reset link">
      {sent ? (
        <div className="space-y-4 text-sm">
          <p>If an account exists for <strong>{email}</strong>, a reset link has been sent.</p>
          <div className="flex flex-col gap-2">
            <Link href="/signin" className="btn btn-primary justify-center">Return to Sign In</Link>
            <button type="button" onClick={() => { setSent(false); setSubmitting(false); }} className="btn btn-outline justify-center">Use another email</button>
          </div>
        </div>
      ) : (
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
          <div className="text-xs">
            Remember your password? <Link href="/signin" className="link link-primary">Sign in</Link>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
