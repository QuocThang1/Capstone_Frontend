import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, MoreHorizontal, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { format, isPast, isToday, startOfDay } from 'date-fns'; // Dùng thư viện date-fns để xử lý ngày tháng cho chuẩn

const getStatusStyles = (status) => {
    if (status === 'Done') {
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
    return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
};

const IssueRow = ({ issue, onSelect, onOpenDeleteModal }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: issue._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = (e) => {
        e.stopPropagation();
        onSelect(issue);
        setMenuOpen(false);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onOpenDeleteModal(issue);
        setMenuOpen(false);
    };

    const handleRowClick = () => {
        if (!isDragging) {
            onSelect(issue);
        }
    };

    const renderDueDate = () => {
        if (!issue.dueDate) return null;


        const dueDateObj = new Date(issue.dueDate);

        const isUrgent = isPast(dueDateObj);

        const formattedDate = format(dueDateObj, 'MMM dd');

        const displayUrgentStyle = isUrgent && issue.status !== 'Done';

        return (
            <div
                className={`flex items-center gap-1.5 px-2 py-0.5 border rounded-md text-xs font-semibold mr-2 transition-colors
                ${displayUrgentStyle
                        ? 'border-red-500 text-red-500 dark:border-red-600 dark:text-red-500'
                        : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'} 
                `}
                title={`Due: ${format(dueDateObj, 'PPpp')}`}
            >
                {displayUrgentStyle && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{formattedDate}</span>
            </div>
        );
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleRowClick}
            className={`flex items-center justify-between p-2 rounded group touch-none cursor-pointer ${isDragging ? 'bg-blue-100 dark:bg-blue-900/50 shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
        >
            <div className="flex items-center gap-3 flex-grow-1 min-w-0">
                <div>
                    <CheckSquare className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500">{issue.issueKey}</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 truncate">{issue.title}</span>
            </div>

            {/* Phân cột hiển thị trạng thái và thông tin bổ sung */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">

                {/* Nơi nhúng badge ngày Due Date */}
                {renderDueDate()}

                {/* Các khối cũ không thay đổi */}
                <div className="flex items-center justify-center w-28 flex-shrink-0 px-2">
                    {issue.status && (
                        <span className={`px-2.5 py-0.5 text-xs font-semibold capitalize rounded ${getStatusStyles(issue.status)}`}>
                            {issue.status}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-md">
                    {issue.storyPoints > 0 ? issue.storyPoints : '-'}
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 flex items-center justify-center text-xs font-bold text-slate-500" title={issue.assigneeId?.fullName || "Unassigned"}>
                    {issue.assigneeId?.fullName ? issue.assigneeId.fullName.charAt(0).toUpperCase() : '?'}
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(prev => !prev);
                        }}
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-opacity"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                            <div className="py-1">
                                <button onClick={handleEdit} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button onClick={handleDeleteClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssueRow;