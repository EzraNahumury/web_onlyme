"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Filter, X, Check, FileText, Eye } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

const statuses: ("All" | ProjectStatus)[] = [
  "All",
  "Waiting",
  "In Progress",
  "Done",
  "Revision",
  "Maintenance",
];

const statusSteps: ProjectStatus[] = [
  "Waiting",
  "In Progress",
  "Revision",
  "Done",
  "Maintenance",
];

function getProgress(status: ProjectStatus): number {
  const idx = statusSteps.indexOf(status);
  return Math.round(((idx + 1) / statusSteps.length) * 100);
}

function getStepIndex(status: ProjectStatus): number {
  return statusSteps.indexOf(status);
}

const stepColors: Record<ProjectStatus, { checked: string; bar: string }> = {
  Waiting: { checked: "bg-yellow-500/10 text-yellow-400", bar: "bg-yellow-400" },
  "In Progress": { checked: "bg-blue-500/10 text-blue-400", bar: "bg-blue-400" },
  Revision: { checked: "bg-orange-500/10 text-orange-400", bar: "bg-orange-400" },
  Done: { checked: "bg-emerald-500/10 text-emerald-400", bar: "bg-emerald-400" },
  Maintenance: { checked: "bg-red-500/10 text-red-400", bar: "bg-red-400" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | ProjectStatus>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Project Board</h1>
          <p className="mt-2 text-zinc-400">
            Public view of all projects and their current status.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "All" | ProjectStatus)}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-10 text-sm text-white outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-zinc-900">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-zinc-600">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl glass">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">No</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Project</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden sm:table-cell">Client</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Progress</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider text-center">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, idx) => {
                  const progress = getProgress(project.status);
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] group"
                    >
                      <td className="px-5 py-4 text-zinc-600 font-mono text-xs">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-white group-hover:text-red-400 transition-colors">{project.projectName}</span>
                        <span className="block sm:hidden text-xs text-zinc-600 mt-0.5">{project.clientName}</span>
                      </td>
                      <td className="px-5 py-4 text-zinc-400 hidden sm:table-cell">{project.clientName}</td>
                      <td className="px-5 py-4 text-zinc-500 whitespace-nowrap hidden md:table-cell text-xs">{project.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-20 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                progress === 100
                                  ? "bg-emerald-400"
                                  : progress >= 60
                                  ? "bg-blue-400"
                                  : "bg-red-400"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-600 w-7">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setSelected(project)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 p-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.projectName}</h2>
                <p className="mt-0.5 text-xs text-zinc-600 font-mono">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Client</p>
                  <p className="text-sm font-semibold text-white">{selected.clientName}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Date</p>
                  <p className="text-sm font-semibold text-white">{selected.date}</p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Description</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{selected.description}</p>
              </div>

              {/* Dev Notes */}
              {selected.devNotes && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-600 mb-1">
                    <FileText className="h-3 w-3" />
                    Dev Notes
                  </div>
                  <p className="text-sm text-zinc-300">{selected.devNotes}</p>
                </div>
              )}

              {/* Progress Tahapan */}
              <div>
                <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  Progress Tahapan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(selected.status);
                    const isChecked = idx <= currentIdx;
                    const colors = stepColors[step];
                    return (
                      <span
                        key={step}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          isChecked
                            ? `${colors.checked} border-current/20`
                            : "border-white/5 bg-white/[0.02] text-zinc-600"
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                        {step}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-2">
                <StatusBadge status={selected.status} />
                {getProgress(selected.status) === 100 && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                    Selesai
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
