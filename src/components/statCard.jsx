const StatCard = ({ title, value, icon, iconColor, borderColor }) => {
    return (
        <div className="glass-card rounded-2xl p-6 border-l-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${iconColor} bg-opacity-10 dark:bg-opacity-20 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
                    <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StatCard;