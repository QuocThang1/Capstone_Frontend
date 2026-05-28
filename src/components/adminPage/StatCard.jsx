import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedNumber({ value }) {
  const raw = String(value);
  const isPercent = raw.includes("%");
  const num = parseFloat(raw.replace(/,/g, "").replace(/%/g, ""));
  const hasDecimal = raw.replace(/%/g, "").includes(".");

  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    if (isNaN(num)) return raw;
    if (isPercent) return (hasDecimal ? v.toFixed(2) : Math.round(v)) + "%";
    if (num >= 1000) return Math.round(v).toLocaleString();
    if (hasDecimal) return v.toFixed(2);
    return Math.round(v).toString();
  });

  useEffect(() => {
    if (!isNaN(num)) {
      const ctrl = animate(mv, num, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
      return ctrl.stop;
    }
  }, []);

  if (isNaN(num)) return <span>{raw}</span>;
  return <motion.span>{display}</motion.span>;
}

const toneClasses = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  blue: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function StatCard({ title, value, change, icon: Icon, tone, delay = 0, className }) {
  const isPositive = change?.startsWith("+");
  const isNegativeChange = change?.startsWith("-");

  return (
    <motion.div
      initial={{ y: 24, scale: 0.97 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay }}
      whileHover={{ y: -5, scale: 1.015, transition: { type: "spring", stiffness: 420, damping: 22 } }}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm cursor-default",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <motion.div
          className={cn("p-3 rounded-lg", toneClasses[tone] || toneClasses.slate)}
          whileHover={{ scale: 1.12, rotate: 8 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </motion.div>

        {change && (
          <motion.div
            initial={{ scale: 0.7, x: 8 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: delay + 0.5, type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              isPositive
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                : isNegativeChange
                ? "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30"
                : "text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-800"
            )}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegativeChange && <TrendingDown className="w-3 h-3" />}
            {change}
          </motion.div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
          <AnimatedNumber value={value} />
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
