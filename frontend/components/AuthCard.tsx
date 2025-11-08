"use client";
import Link from "next/link";
import React from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md shadow-xl border border-base-300">
        <div className="card-body">
          <h1 className="card-title justify-center mb-2 text-2xl">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-base-content/70 text-center mb-4">{subtitle}</p>
          ) : null}
          {children}
          <div className="mt-4 text-center text-xs text-base-content/60">
            <Link href="/" className="link link-hover">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
