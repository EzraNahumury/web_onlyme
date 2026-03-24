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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Project Board</h1>
        <p className="mt-2 text-zinc-400">
          Public view of all projects and their current status.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | ProjectStatus)}
            className="appearance-none rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-8 text-sm text-white outline-none focus:border-emerald-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          No projects found.
        </div>
      ) : (
        <>
          {/* Table view */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400 text-xs uppercase tracking-wider text-center">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, idx) => {
                  const progress = getProgress(project.status);
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/50"
                    >
                      <td className="px-4 py-4 text-zinc-500">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-white">{project.projectName}</span>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{project.clientName}</td>
                      <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">{project.date}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress === 100
                                  ? "bg-emerald-500"
                                  : progress >= 60
                                  ? "bg-blue-500"
                                  : "bg-indigo-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-400 w-8">{progress}%</span>
                        </div>
                        <span className="text-xs text-zinc-500 mt-0.5 block">{project.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelected(project)}
                          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-emerald-500 hover:text-emerald-400"
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
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-zinc-800 p-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.projectName}</h2>
                <p className="mt-0.5 text-sm text-zinc-400">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500 mb-1">Client</p>
                  <p className="text-sm font-semibold text-white">{selected.clientName}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500 mb-1">Date</p>
                  <p className="text-sm font-semibold text-white">{selected.date}</p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-xs text-zinc-500 mb-1">Description</p>
                <p className="text-sm text-zinc-300">{selected.description}</p>
              </div>

              {/* Dev Notes */}
              {selected.devNotes && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <FileText className="h-3 w-3" />
                    Dev Notes
                  </div>
                  <p className="text-sm text-zinc-300">{selected.devNotes}</p>
                </div>
              )}

              {/* Progress Tahapan */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Progress Tahapan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(selected.status);
                    const isChecked = idx <= currentIdx;

                    return (
                      <span
                        key={step}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          isChecked
                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                            : "border-zinc-800 bg-zinc-950 text-zinc-500"
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                        {step}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 pt-2">
                <StatusBadge status={selected.status} />
                {getProgress(selected.status) === 100 && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
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
