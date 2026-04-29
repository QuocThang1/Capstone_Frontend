import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, User } from 'lucide-react';

const IssueCard = ({ issue, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: issue._id, data: { type: 'Issue', issue } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`
            : parts[0][0];
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer touch-none"
        >
            <p className="text-sm text-slate-800 dark:text-slate-200 mb-2">{issue.title}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckSquare className="w-4 h-4 text-blue-500" />
                    <span>{issue.issueKey}</span>
                </div>
                {issue.assigneeId ? (
                    <div
                        title={issue.assigneeId.fullName}
                        className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300"
                    >
                        {getInitials(issue.assigneeId.fullName)}
                    </div>
                ) : (
                    <div
                        title="Unassigned"
                        className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
                    >
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueCard;