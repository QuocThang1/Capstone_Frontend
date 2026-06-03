import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionCard({ title, description, actions, children, className }) {
  return (
    <motion.div
      initial={{ y: 18 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col",
        className
      )}
    >
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>
        )}
      </div>
      <div className="p-6 flex-1">{children}</div>
    </motion.div>
  );
}
