import type { ProjectStatus } from "@/lib/types";

const statusConfig: Record<ProjectStatus, { bg: string; text: string; dot: string; ring: string }> = {
  Waiting: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
    ring: "ring-yellow-500/20",
  },
  "In Progress": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
    ring: "ring-blue-500/20",
  },
  Done: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/20",
  },
  Revision: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    dot: "bg-orange-400",
    ring: "ring-orange-500/20",
  },
  Maintenance: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
    ring: "ring-red-500/20",
  },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] ?? statusConfig.Waiting;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${config.bg} ${config.text} ${config.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
      {status}
    </span>
  );
}
