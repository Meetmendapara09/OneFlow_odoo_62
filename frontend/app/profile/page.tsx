"use client";
import React, { useState } from "react";
import FormField from "@/components/FormField";

export default function ProfilePage() {
  const [name, setName] = useState("Meet Patel");
  const [email, setEmail] = useState("meet@OneFlow.ac.in");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Profile saved successfully");
    setTimeout(() => setMsg(null), 1200);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <form onSubmit={onSave} className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <FormField id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="md:col-span-2">
          <FormField id="pwd" label="Change Password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn btn-ghost" type="button" onClick={() => { setPwd(""); setMsg(null); }}>Reset</button>
        </div>
      </form>
      {msg && <div className="alert alert-success max-w-3xl"><span>{msg}</span></div>}
    </div>
  );
}