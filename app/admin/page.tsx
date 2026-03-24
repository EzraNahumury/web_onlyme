"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Loader2,
  Save,
  LogOut,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

const statusSteps: ProjectStatus[] = [
  "Waiting",
  "In Progress",
  "Revision",
  "Done",
  "Maintenance",
];

const stepColors: Record<ProjectStatus, { checked: string; current: string; icon: string }> = {
  Waiting: { checked: "border-yellow-500/30 bg-yellow-500/10", current: "border-yellow-500/40 bg-yellow-500/15", icon: "bg-yellow-500 text-white" },
  "In Progress": { checked: "border-blue-500/30 bg-blue-500/10", current: "border-blue-500/40 bg-blue-500/15", icon: "bg-blue-500 text-white" },
  Revision: { checked: "border-orange-500/30 bg-orange-500/10", current: "border-orange-500/40 bg-orange-500/15", icon: "bg-orange-500 text-white" },
  Done: { checked: "border-emerald-500/30 bg-emerald-500/10", current: "border-emerald-500/40 bg-emerald-500/15", icon: "bg-emerald-500 text-white" },
  Maintenance: { checked: "border-red-500/30 bg-red-500/10", current: "border-red-500/40 bg-red-500/15", icon: "bg-red-500 text-white" },
};

function getStepIndex(status: ProjectStatus): number {
  return statusSteps.indexOf(status);
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ projectName: "", clientName: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);

  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (loggedIn) fetchProjects();
  }, [loggedIn]);

  const handleStatusClick = (projectId: string, clickedStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: clickedStatus } : p))
    );
  };

  const handleUpdate = async (project: Project) => {
    setSaving(project.id);
    setSaveSuccess(null);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: project.id, status: project.status, devNotes: project.devNotes }),
      });
      if (!res.ok) throw new Error("Update failed");
      setSaveSuccess(project.id);
      setTimeout(() => setSaveSuccess(null), 2000);
    } catch {
      alert("Failed to update project");
    } finally {
      setSaving(null);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditForm({ projectName: project.projectName, clientName: project.clientName, description: project.description });
  };

  const handleEdit = async () => {
    if (!editingProject) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editingProject.id, ...editForm }),
      });
      if (!res.ok) throw new Error("Edit failed");
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? { ...p, ...editForm } : p)));
      setEditingProject(null);
    } catch {
      alert("Failed to edit project");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: deletingProject.id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setDeletingProject(null);
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Login
  if (!loggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
              <Lock className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-fade-in-scale">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="animate-fade-in">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">Update project statuses and dev notes.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2.5 text-sm text-zinc-300 transition-all hover:text-white hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center text-zinc-600">No projects yet.</div>
        ) : (
          <div className="space-y-3 stagger-children">
            {projects.map((project) => {
              const isExpanded = expanded === project.id;
              const currentIdx = getStepIndex(project.status);

              return (
                <div
                  key={project.id}
                  className="rounded-2xl glass overflow-hidden transition-all duration-300 animate-fade-in"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-5">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : project.id)}
                    >
                      <h3 className="text-base font-semibold text-white truncate mb-1">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {project.clientName} &middot; {project.date}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {statusSteps.map((step, idx) => {
                          const isChecked = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <span
                              key={step}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                                isChecked
                                  ? isCurrent
                                    ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
                                    : "bg-white/5 text-zinc-400"
                                  : "bg-white/[0.02] text-zinc-700"
                              }`}
                            >
                              {isChecked && <Check className="h-2.5 w-2.5" />}
                              {step}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                        className="rounded-lg p-2 text-zinc-600 transition-all hover:bg-blue-500/10 hover:text-blue-400"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingProject(project); }}
                        className="rounded-lg p-2 text-zinc-600 transition-all hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <StatusBadge status={project.status} />
                      <button
                        onClick={() => setExpanded(isExpanded ? null : project.id)}
                        className="rounded-lg p-1.5 text-zinc-600 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-white/5 p-5 animate-fade-in">
                      <p className="mb-5 text-sm text-zinc-400 leading-relaxed">{project.description}</p>

                      <div className="mb-5">
                        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                          Checklist Tahapan Project
                        </h4>
                        <div className="space-y-2">
                          {statusSteps.map((step, idx) => {
                            const isChecked = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            const isNext = idx === currentIdx + 1;
                            const colors = stepColors[step];

                            return (
                              <button
                                key={step}
                                onClick={() => handleStatusClick(project.id, step)}
                                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:scale-[1.005] active:scale-[0.998] ${
                                  isChecked
                                    ? isCurrent
                                      ? colors.current
                                      : colors.checked
                                    : isNext
                                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                                    : "border-white/5 bg-white/[0.01]"
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all ${
                                    isChecked ? colors.icon : "border-2 border-zinc-700"
                                  }`}
                                >
                                  {isChecked && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <span className={`flex-1 text-sm font-medium ${isChecked ? "text-white" : "text-zinc-600"}`}>
                                  {idx + 1}. {step}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                                    Tahap ini
                                  </span>
                                )}
                                {isChecked && <Check className={`h-3.5 w-3.5 ${isCurrent ? "text-red-400" : "text-zinc-500"}`} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                          Dev Notes
                        </label>
                        <textarea
                          value={project.devNotes}
                          onChange={(e) => updateProject(project.id, "devNotes", e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 resize-none"
                          placeholder="Add development notes..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleUpdate(project)}
                          disabled={saving === project.id}
                          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            saveSuccess === project.id
                              ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20"
                          } disabled:opacity-50`}
                        >
                          {saving === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {saveSuccess === project.id ? "Saved!" : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setEditingProject(null)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <Pencil className="h-4 w-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Edit Project</h2>
              </div>
              <button onClick={() => setEditingProject(null)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Project Name</label>
                <input type="text" value={editForm.projectName} onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Client Name</label>
                <input type="text" value={editForm.clientName} onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Description</label>
                <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/5 p-5">
              <button onClick={() => setEditingProject(null)} className="rounded-xl glass glass-hover px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Cancel</button>
              <button onClick={handleEdit} disabled={editLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50 transition-all">
                {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setDeletingProject(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
                <Trash2 className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Delete Project?</h2>
              <p className="text-sm text-zinc-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">&quot;{deletingProject.projectName}&quot;</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-white/5 p-5">
              <button onClick={() => setDeletingProject(null)} className="flex-1 rounded-xl glass glass-hover py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50 transition-all">
                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
