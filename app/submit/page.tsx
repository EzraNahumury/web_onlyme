"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, FileText } from "lucide-react";

export default function SubmitPage() {
  const [form, setForm] = useState({
    projectName: "",
    clientName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit project");

      setSuccess(true);
      setForm({ projectName: "", clientName: "", description: "" });
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
            <FileText className="h-6 w-6 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Submit a Project</h1>
          <p className="mt-2 text-zinc-400">
            Fill out the form below and we&apos;ll get back to you.
          </p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400 animate-fade-in-scale">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Project submitted successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-fade-in-scale">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Project Name
            </label>
            <input
              type="text"
              required
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-red-500/20"
              placeholder="e.g. Company Website Redesign"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Client Name
            </label>
            <input
              type="text"
              required
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-red-500/20"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-red-500/20 resize-none"
              placeholder="Describe your project requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
