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

  // Edit modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ projectName: "", clientName: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirm state
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: project.id,
          status: project.status,
          devNotes: project.devNotes,
        }),
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
    setEditForm({
      projectName: project.projectName,
      clientName: project.clientName,
      description: project.description,
    });
  };

  const handleEdit = async () => {
    if (!editingProject) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingProject.id,
          ...editForm,
        }),
      });
      if (!res.ok) throw new Error("Edit failed");

      // Update local state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id ? { ...p, ...editForm } : p
        )
      );
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deletingProject.id }),
      });
      if (!res.ok) throw new Error("Delete failed");

      // Remove from local state
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
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Login form
  if (!loggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <Lock className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-black transition-colors hover:bg-emerald-400 disabled:opacity-50"
            >
              {loginLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Update project statuses and dev notes.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">No projects yet.</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isExpanded = expanded === project.id;
            const currentIdx = getStepIndex(project.status);

            return (
              <div
                key={project.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
              >
                {/* Header - always visible */}
                <div className="flex items-center justify-between p-5">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : project.id)}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {project.projectName}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {project.clientName} &middot; {project.date}
                    </p>
                    {/* Status pills summary */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {statusSteps.map((step, idx) => {
                        const isChecked = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        return (
                          <span
                            key={step}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                              isChecked
                                ? isCurrent
                                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
                                  : "bg-indigo-500/15 text-indigo-400"
                                : "bg-zinc-800 text-zinc-500"
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3" />}
                            {step}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(project);
                      }}
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                      title="Edit project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingProject(project);
                      }}
                      className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <StatusBadge status={project.status} />
                    <button
                      onClick={() => setExpanded(isExpanded ? null : project.id)}
                      className="rounded-lg p-1 text-zinc-500 hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 p-5">
                    {/* Description */}
                    <p className="mb-5 text-sm text-zinc-400">{project.description}</p>

                    {/* Checklist */}
                    <div className="mb-5">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Checklist Tahapan Project
                      </h4>
                      <div className="space-y-2">
                        {statusSteps.map((step, idx) => {
                          const isChecked = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          const isNext = idx === currentIdx + 1;

                          return (
                            <button
                              key={step}
                              onClick={() => handleStatusClick(project.id, step)}
                              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                                isChecked
                                  ? isCurrent
                                    ? "border-emerald-500/40 bg-emerald-500/10"
                                    : "border-indigo-500/30 bg-indigo-500/10"
                                  : isNext
                                  ? "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                                  : "border-zinc-800 bg-zinc-900/30"
                              }`}
                            >
                              {/* Checkbox */}
                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
                                  isChecked
                                    ? isCurrent
                                      ? "bg-emerald-500 text-white"
                                      : "bg-indigo-500 text-white"
                                    : "border-2 border-zinc-600"
                                }`}
                              >
                                {isChecked && <Check className="h-4 w-4" />}
                              </div>

                              {/* Label */}
                              <span
                                className={`flex-1 text-sm font-medium ${
                                  isChecked ? "text-white" : "text-zinc-500"
                                }`}
                              >
                                {idx + 1}. {step}
                              </span>

                              {/* Current badge */}
                              {isCurrent && (
                                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                                  Tahap ini
                                </span>
                              )}

                              {/* Check icon on the right */}
                              {isChecked && (
                                <Check
                                  className={`h-4 w-4 ${
                                    isCurrent ? "text-emerald-400" : "text-indigo-400"
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dev Notes */}
                    <div className="mb-4">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Dev Notes
                      </label>
                      <textarea
                        value={project.devNotes}
                        onChange={(e) =>
                          updateProject(project.id, "devNotes", e.target.value)
                        }
                        rows={2}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 resize-none"
                        placeholder="Add development notes..."
                      />
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdate(project)}
                        disabled={saving === project.id}
                        className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                          saveSuccess === project.id
                            ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                            : "bg-emerald-500 text-black hover:bg-emerald-400"
                        } disabled:opacity-50`}
                      >
                        {saving === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
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

      {/* Edit Modal */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Pencil className="h-4 w-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Edit Project</h2>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={editForm.projectName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, projectName: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Client Name
                </label>
                <input
                  type="text"
                  value={editForm.clientName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, clientName: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-800 p-5">
              <button
                onClick={() => setEditingProject(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
              >
                {editLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDeletingProject(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <Trash2 className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Delete Project?</h2>
              <p className="text-sm text-zinc-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  &quot;{deletingProject.projectName}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-zinc-800 p-5">
              <button
                onClick={() => setDeletingProject(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
