import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { createIssueApi } from '../../../utils/Api/issueApi';
import { toast } from 'react-toastify';
import IssueRow from './issueRow';
import ButtonSpinner from '../../ButtonSpinner';

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const SprintContainer = ({ sprint, issues, project, onEdit, onDelete, onIssueSelect, onOpenDeleteIssueModal, onDataUpdate }) => {
    const [isCreatingIssue, setCreatingIssue] = useState(false);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [selectedIssueType, setSelectedIssueType] = useState(project.issueTypes?.[0]?.name || '');
    const [actionLoading, setActionLoading] = useState(false);

    const dropdownRef = useRef(null);
    const createIssueInputRef = useRef(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const isBacklog = sprint.name === 'Backlog';

    const { setNodeRef, isOver } = useDroppable({ id: sprint._id });

    const formattedStartDate = formatDate(sprint.startDate);
    const formattedEndDate = formatDate(sprint.endDate);

    const totalStoryPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

    useEffect(() => {
        if (isCreatingIssue) {
            createIssueInputRef.current?.focus();
        }
    }, [isCreatingIssue]);

    const handleCreateIssue = async () => {
        if (!newIssueTitle.trim()) return;
        setActionLoading(true);
        try {
            const issueData = { projectId: project._id, sprintId: sprint._id, title: newIssueTitle, type: selectedIssueType };
            const res = await createIssueApi(issueData);
            if (res && res.EC === 0) {
                toast.success("Issue created!");
                setCreatingIssue(false);
                setNewIssueTitle('');
                onDataUpdate();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer"><ChevronDown className="w-5 h-5" /></button>
                    <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{sprint.name}</h3>
                        {formattedStartDate && formattedEndDate && (<span className="text-sm text-slate-500 dark:text-slate-400">{formattedStartDate} – {formattedEndDate}</span>)}
                    </div>
                    <span className="text-sm text-slate-500">({issues.length} issues)</span>
                </div>
                {!isBacklog && (
                    <div className="flex items-center gap-2 relative">
                        <span className="text-sm font-semibold text-slate-500">{totalStoryPoints} story points</span>
                        <button className="px-3 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer">Start sprint</button>
                        <button onClick={() => setDropdownOpen(prev => !prev)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer"><MoreHorizontal className="w-5 h-5" /></button>
                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-8 w-40 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <button onClick={() => { onEdit(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><Edit className="w-4 h-4" /><span>Edit sprint</span></button>
                                    <button onClick={() => { onDelete(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"><Trash2 className="w-4 h-4" /><span>Delete sprint</span></button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <SortableContext items={issues.map(i => i._id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className={`p-2 space-y-2 transition-colors min-h-[80px] ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    {issues.map(issue => (
                        <IssueRow key={issue._id} issue={issue} onSelect={onIssueSelect} onOpenDeleteModal={onOpenDeleteIssueModal} />
                    ))}
                    {isCreatingIssue ? (
                        <div className="bg-white dark:bg-slate-800 rounded-md border border-blue-500 shadow-sm p-2 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <select value={selectedIssueType} onChange={(e) => setSelectedIssueType(e.target.value)} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                    {project.issueTypes.map(type => (<option key={type.name} value={type.name}>{type.name}</option>))}
                                </select>
                                <input ref={createIssueInputRef} type="text" value={newIssueTitle} onChange={(e) => setNewIssueTitle(e.target.value)} placeholder="What needs to be done?" className="flex-grow bg-transparent focus:outline-none px-1 py-0.5 text-slate-800 dark:text-slate-200" onKeyDown={(e) => e.key === 'Enter' && handleCreateIssue()} />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setCreatingIssue(false); setNewIssueTitle(''); }} className="px-5 py-2 text-sm font-semibold rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer">Cancel</button>
                                <button onClick={handleCreateIssue} disabled={actionLoading} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 cursor-pointer">
                                    {actionLoading ? <ButtonSpinner /> : 'Create'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setCreatingIssue(true)} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-md w-full hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                            <Plus className="w-4 h-4" /><span>Create issue</span>
                        </button>
                    )}
                    {issues.length === 0 && !isCreatingIssue && (
                        <div className="flex items-center justify-center min-h-[60px]">
                            <p className="text-sm text-slate-400 text-center">{isBacklog ? "Issues that aren't in any sprint will appear here." : "Drag issues here to add them to this sprint."}</p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default SprintContainer;