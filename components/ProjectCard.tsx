import { Calendar, User, FileText } from "lucide-react";
import type { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {project.projectName}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {project.clientName}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {project.date}
        </span>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-zinc-400">
        {project.description}
      </p>

      {project.devNotes && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <FileText className="h-3 w-3" />
            Dev Notes
          </div>
          <p className="text-sm text-zinc-300">{project.devNotes}</p>
        </div>
      )}
    </div>
  );
}
