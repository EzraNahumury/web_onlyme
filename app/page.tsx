"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Send,
  LayoutGrid,
  Shield,
  Clock,
  Loader,
  CheckCircle,
  RotateCcw,
  Wrench,
  FolderOpen,
} from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";

const statusConfig: {
  key: ProjectStatus;
  label: string;
  icon: typeof Clock;
  color: string;
  bg: string;
  border: string;
  bar: string;
}[] = [
  {
    key: "Waiting",
    label: "Waiting",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    bar: "bg-yellow-400",
  },
  {
    key: "In Progress",
    label: "In Progress",
    icon: Loader,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    bar: "bg-blue-400",
  },
  {
    key: "Revision",
    label: "Revision",
    icon: RotateCcw,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    bar: "bg-orange-400",
  },
  {
    key: "Done",
    label: "Done",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    bar: "bg-emerald-400",
  },
  {
    key: "Maintenance",
    label: "Maintenance",
    icon: Wrench,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    bar: "bg-purple-400",
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const total = projects.length;
  const countByStatus = (s: ProjectStatus) =>
    projects.filter((p) => p.status === s).length;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Project Progress Tracker
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Track Your Project
          <br />
          <span className="text-emerald-400">Progress in Real-Time</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-400">
          Submit your project, track its status, and stay updated with
          real-time progress from our development board.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            <Send className="h-4 w-4" />
            Submit a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <LayoutGrid className="h-4 w-4" />
            View Project Board
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
        {[
          {
            icon: Send,
            title: "Submit",
            desc: "Send your project details and requirements through our simple form.",
          },
          {
            icon: LayoutGrid,
            title: "Track",
            desc: "Monitor project progress with real-time status updates on the board.",
          },
          {
            icon: Shield,
            title: "Manage",
            desc: "Admin dashboard for updating project statuses and dev notes.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <item.icon className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Dashboard Status */}
      {loaded && (
        <div className="mx-auto mt-20 w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Dashboard Status
            </h2>
            <p className="mt-2 text-zinc-400">
              Overview of all project statuses in real-time.
            </p>
          </div>

          {/* Total card */}
          <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <FolderOpen className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Projects</p>
                  <p className="text-3xl font-bold text-white">{total}</p>
                </div>
              </div>
              {/* Mini bar chart */}
              {total > 0 && (
                <div className="hidden sm:flex items-end gap-1 h-12">
                  {statusConfig.map((s) => {
                    const count = countByStatus(s.key);
                    const height = total > 0 ? Math.max((count / total) * 100, count > 0 ? 15 : 4) : 4;
                    return (
                      <div
                        key={s.key}
                        className={`w-6 rounded-t-sm ${s.bar} transition-all`}
                        style={{ height: `${height}%` }}
                        title={`${s.label}: ${count}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {/* Progress bar */}
            {total > 0 && (
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-zinc-800">
                {statusConfig.map((s) => {
                  const count = countByStatus(s.key);
                  if (count === 0) return null;
                  const pct = (count / total) * 100;
                  return (
                    <div
                      key={s.key}
                      className={`${s.bar} transition-all`}
                      style={{ width: `${pct}%` }}
                      title={`${s.label}: ${count} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Status cards grid */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {statusConfig.map((s) => {
              const count = countByStatus(s.key);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const Icon = s.icon;

              return (
                <div
                  key={s.key}
                  className={`rounded-xl border ${s.border} ${s.bg} p-4 transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-5 w-5 ${s.color}`} />
                    <span className={`text-2xl font-bold ${s.color}`}>
                      {count}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-300">{s.label}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.bar} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent projects */}
          {projects.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Recent Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => {
                  const cfg = statusConfig.find((s) => s.key === project.status) ?? statusConfig[0];
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white truncate">
                          {project.projectName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {project.clientName} &middot; {project.date}
                        </p>
                      </div>
                      <span
                        className={`ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.bar}`} />
                        {project.status}
                      </span>
                    </div>
                  );
                })}
              </div>
              {projects.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/projects"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View all {total} projects &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
