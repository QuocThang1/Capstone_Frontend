import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Helper function to get initials from a name
const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`
        : parts[0][0];
};

const HistoryItem = ({ entry }) => {
    const { authorId, field, oldValue, newValue, createdAt } = entry;

    const renderValue = (value) => {
        if (value === null || value === 'Unassigned' || value === '') {
            return <span className="text-slate-500 italic">Unassigned</span>;
        }
        return <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-xs font-medium">{value}</span>;
    };

    return (
        <div className="flex items-start gap-3 py-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center font-bold text-sm text-white">
                {getInitials(authorId?.fullName)}
            </div>

            {/* Content */}
            <div className="w-full">
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{authorId?.fullName || 'Anonymous'}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        updated the
                    </span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{field}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </div>

                {/* Value Change */}
                {(oldValue !== undefined || newValue !== undefined) && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                        {renderValue(oldValue)}
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        {renderValue(newValue)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryItem;