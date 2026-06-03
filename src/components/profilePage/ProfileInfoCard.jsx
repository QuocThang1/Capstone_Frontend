export default function ProfileInfoCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        {Icon && <Icon className="w-4 h-4 text-[#6366F1]" />}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {items.map(({ label, value, badge }) => (
          <li
            key={label}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
            {badge ? (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/20 dark:text-indigo-300">
                {value}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                {value || <span className="text-slate-400 dark:text-slate-500 italic">—</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
