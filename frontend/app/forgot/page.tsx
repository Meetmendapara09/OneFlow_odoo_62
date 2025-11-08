"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import Image from "next/image";

interface Errors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!email) {
      next.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSent(true);
    setSubmitting(false);
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

        {/* Card */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#E2E8F0]">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFF6FF] mb-4">
                  <KeyRound className="w-8 h-8 text-[#2563EB]" />
                </div>
                <p className="text-lg text-[#64748B]">No worries, we&apos;ll send you reset instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                    placeholder="Enter your email"
                    className={`input input-bordered w-full bg-white border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
                      errors.email ? 'input-error' : ''
                    }`}
                  />
                  {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full text-base h-12"
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Send Reset Link
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link href="/signin" className="text-sm text-[#2563EB] hover:underline flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#ECFDF5]">
                <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-[#1E293B]">Check Your Email</h2>
                <p className="text-[#64748B] mt-2">
                  We've sent a password reset link to <strong className="text-[#1E293B]">{email}</strong>.
                </p>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-4 text-sm text-[#475569] border border-[#E2E8F0]">
                <p>
                  💡 Didn&lsquo;t receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/signin"
                  className="btn bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"
                >
                  Return to Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                    setErrors({});
                  }}
                  className="btn btn-ghost w-full"
                >
                  Use a different email
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#64748B]">
          <p>
            If you're still having trouble, contact our{" "}
            <a href="mailto:support@oneflow.com" className="text-[#2563EB] hover:underline">
              support team
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
