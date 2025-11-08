"use client";
import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export default function FormField({ label, error, id, ...props }: FormFieldProps) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        id={id}
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
        {...props}
      />
      {error ? (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      ) : null}
    </div>
  );
}
