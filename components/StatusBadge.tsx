import type { ProjectStatus } from "@/lib/types";

const statusConfig: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  Waiting: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  "In Progress": { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  Done: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  Revision: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  Maintenance: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] ?? statusConfig.Waiting;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
