import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, className }) {
  const normalizedStatus = status?.toLowerCase() || "";

  let colorClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  let dotColor = null;
  let pulse = false;

  const emeralds = ["active", "operational", "success", "healthy", "paid", "completed", "resolved", "sent", "enabled"];
  const ambers = ["warning", "trial", "pending", "scheduled", "draft", "in progress", "processing", "degraded", "open"];
  const reds = ["suspended", "down", "critical", "failed", "locked", "overdue", "rejected", "closed", "cancelled"];
  const blues = ["info", "monitoring", "investigating"];

  if (emeralds.includes(normalizedStatus)) {
    colorClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    dotColor = "bg-emerald-500";
    pulse = normalizedStatus === "operational" || normalizedStatus === "active";
  } else if (ambers.includes(normalizedStatus)) {
    colorClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    dotColor = normalizedStatus === "degraded" || normalizedStatus === "pending" ? "bg-amber-500" : null;
    pulse = normalizedStatus === "degraded";
  } else if (reds.includes(normalizedStatus)) {
    colorClass = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    dotColor = "bg-red-500";
    pulse = normalizedStatus === "down" || normalizedStatus === "critical";
  } else if (blues.includes(normalizedStatus)) {
    colorClass = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {dotColor && (
        <motion.span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)}
          animate={pulse ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
          transition={pulse ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : {}}
        />
      )}
      {status}
    </span>
  );
}
