"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import EarthGlobe from "@/components/EarthGlobe";

const statusConfig: {
  key: ProjectStatus;
  label: string;
  icon: typeof Clock;
  color: string;
  bg: string;
  border: string;
  bar: string;
  gradient: string;
}[] = [
  {
    key: "Waiting",
    label: "Waiting",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    bar: "bg-yellow-400",
    gradient: "from-yellow-500/20 to-yellow-500/0",
  },
  {
    key: "In Progress",
    label: "In Progress",
    icon: Loader,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    bar: "bg-blue-400",
    gradient: "from-blue-500/20 to-blue-500/0",
  },
  {
    key: "Revision",
    label: "Revision",
    icon: RotateCcw,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    bar: "bg-orange-400",
    gradient: "from-orange-500/20 to-orange-500/0",
  },
  {
    key: "Done",
    label: "Done",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    bar: "bg-emerald-400",
    gradient: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    key: "Maintenance",
    label: "Maintenance",
    icon: Wrench,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    bar: "bg-red-400",
    gradient: "from-red-500/20 to-red-500/0",
  },
];

function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

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
    <div className="flex flex-1 flex-col items-center px-4">
      {/* Hero */}
      <section className="relative flex w-full max-w-5xl flex-col items-center pt-20 pb-16 sm:pt-28 sm:pb-20">
        <EarthGlobe />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-red-500/8 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="animate-fade-in relative text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-red-400">
            <Sparkles className="h-3.5 w-3.5" />
            Project Progress Tracker
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
            Track Your Project
            <br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-rose-400 bg-clip-text text-transparent animate-gradient-x">
              Progress in Real-Time
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-base text-zinc-400 sm:text-lg leading-relaxed">
            Submit your project, track its status, and stay updated with
            real-time progress from our development board.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/submit"
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              Submit a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-2xl glass glass-hover px-7 py-3.5 font-semibold text-zinc-300 transition-all hover:text-white hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutGrid className="h-4 w-4" />
              View Project Board
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="w-full max-w-4xl animate-slide-up">
        <div className="grid gap-4 sm:grid-cols-3 stagger-children">
          {[
            {
              icon: Send,
              title: "Submit",
              desc: "Send your project details and requirements through our simple form.",
              gradient: "from-red-500/15 to-transparent",
            },
            {
              icon: LayoutGrid,
              title: "Track",
              desc: "Monitor project progress with real-time status updates on the board.",
              gradient: "from-white/5 to-transparent",
            },
            {
              icon: Shield,
              title: "Manage",
              desc: "Admin dashboard for updating project statuses and dev notes.",
              gradient: "from-red-500/10 to-transparent",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl glass glass-hover p-6 text-center transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20 transition-transform group-hover:scale-110">
                  <item.icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Status */}
      {loaded && (
        <section className="w-full max-w-4xl mt-20 mb-16 animate-slide-up">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-zinc-400">
              <TrendingUp className="h-3 w-3" />
              Live Dashboard
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Dashboard Status
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Overview of all project statuses in real-time
            </p>
          </div>

          {/* Total card */}
          <div className="mb-6 rounded-2xl glass p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5 ring-1 ring-red-500/20">
                  <FolderOpen className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Total Projects</p>
                  <p className="text-4xl font-bold text-white">
                    <AnimatedCount value={total} />
                  </p>
                </div>
              </div>
              {total > 0 && (
                <div className="hidden sm:flex items-end gap-1.5 h-14">
                  {statusConfig.map((s) => {
                    const count = countByStatus(s.key);
                    const height = total > 0 ? Math.max((count / total) * 100, count > 0 ? 18 : 6) : 6;
                    return (
                      <div
                        key={s.key}
                        className={`w-5 rounded-t-md ${s.bar} transition-all duration-700 ease-out opacity-80 hover:opacity-100`}
                        style={{ height: `${height}%` }}
                        title={`${s.label}: ${count}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {total > 0 && (
              <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/5">
                {statusConfig.map((s) => {
                  const count = countByStatus(s.key);
                  if (count === 0) return null;
                  const pct = (count / total) * 100;
                  return (
                    <div
                      key={s.key}
                      className={`${s.bar} transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Status cards */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 stagger-children">
            {statusConfig.map((s) => {
              const count = countByStatus(s.key);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const Icon = s.icon;
              return (
                <div
                  key={s.key}
                  className="group relative overflow-hidden rounded-2xl glass p-4 transition-all duration-300 hover:scale-[1.03] animate-fade-in cursor-default"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${s.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                        <Icon className={`h-4 w-4 ${s.color}`} />
                      </div>
                      <span className={`text-2xl font-bold ${s.color}`}>
                        <AnimatedCount value={count} />
                      </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-400 mb-2">{s.label}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.bar} transition-all duration-700 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent projects */}
          {projects.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                Recent Projects
              </h3>
              <div className="space-y-2 stagger-children">
                {projects.slice(0, 5).map((project) => {
                  const cfg = statusConfig.find((s) => s.key === project.status) ?? statusConfig[0];
                  return (
                    <div
                      key={project.id}
                      className="group flex items-center justify-between rounded-xl glass glass-hover px-4 py-3 transition-all duration-200 animate-fade-in cursor-default"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white truncate text-sm group-hover:text-red-400 transition-colors">
                          {project.projectName}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {project.clientName} &middot; {project.date}
                        </p>
                      </div>
                      <span className={`ml-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${cfg.bg} ${cfg.color} ring-current/20`}>
                        <span className={`h-1 w-1 rounded-full ${cfg.bar}`} />
                        {project.status}
                      </span>
                    </div>
                  );
                })}
              </div>
              {projects.length > 5 && (
                <div className="mt-5 text-center">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    View all {total} projects
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
