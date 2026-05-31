export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
    </div>
  );
}
