import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import IssueCard from './IssueCard';

const BoardColumn = ({ column, issues, onIssueClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.name,
        data: {
            type: 'Column',
            column: column,
        },
    });

    const {
        attributes,
        listeners,
        setNodeRef: setSortableNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.name,
        data: {
            type: 'Column',
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setSortableNodeRef}
                style={style}
                className="w-72 flex-shrink-0 bg-slate-200 dark:bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-400 h-full"
            />
        );
    }

    return (
        <div
            ref={setSortableNodeRef}
            style={style}
            className="w-72 h-fullflex-shrink-0 flex flex-col"
        >
            <div
                ref={setNodeRef}
                className={`bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2 h-full flex flex-col transition-colors ${isOver ? 'ring-2 ring-indigo-500' : ''}`}
            >
                {/* Column Header */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center justify-between px-2 py-1 mb-2 cursor-grab"
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {column.name}
                        </h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                        {issues.length}
                    </span>
                </div>

                {/* Issues Container */}
                <div className="space-y-3 h-full overflow-y-auto">
                    <SortableContext items={issues.map(i => i._id)} strategy={verticalListSortingStrategy}>
                        {issues.map(issue => (
                            <IssueCard key={issue._id} issue={issue} onClick={() => onIssueClick(issue)} />
                        ))}
                    </SortableContext>
                </div>
            </div>
        </div>
    );
};

export default BoardColumn;