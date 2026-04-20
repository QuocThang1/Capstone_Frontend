import { useState, useRef, useEffect } from 'react';
import { CheckSquare, MoreHorizontal, Trash2, Edit } from 'lucide-react';

const IssueRow = ({ issue, onSelect, onOpenDeleteModal }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
        onSelect(issue);
    };

    return (
        <div onClick={handleRowClick} className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer group">
            <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-slate-500">{issue.issueKey}</span>
                <span className="text-sm text-slate-800 dark:text-slate-200">{issue.title}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-md">
                    {issue.storyPoints > 0 ? issue.storyPoints : '-'}
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
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