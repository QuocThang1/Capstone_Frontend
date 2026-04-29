import { useState, useEffect, useCallback } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { getSprintsByProjectApi, createSprintApi, updateSprintApi, deleteSprintApi } from '../../../../utils/Api/sprintApi';
import { getIssuesByProjectApi, deleteIssueApi, updateIssueApi } from '../../../../utils/Api/issueApi';
import { toast } from 'react-toastify';
import Spinner from '../../../../components/spinner';
import SprintContainer from '../../../../components/projectPage/Backlog/sprintContainer';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import EditSprintModal from './Sprint/editSprintModal';
import DeleteSprintModal from './Sprint/deleteSprintModal';
import IssueDetailPanel from './Issue/issueDetailPanel';
import DeleteIssueModal from './Issue/deleteIssueModal';

const Backlog = () => {
    const { projectId } = useParams();
    const { project } = useOutletContext();

    // State tập trung
    const [sprints, setSprints] = useState([]);
    const [issues, setIssues] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // State cho Sprint
    const [isCreating, setIsCreating] = useState(false);
    const [newSprintName, setNewSprintName] = useState("");
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);

    // State cho Issue
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueToDelete, setIssueToDelete] = useState(null);
    const [subtaskTrigger, setSubtaskTrigger] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const fetchData = useCallback(async () => {
        try {
            const [sprintsRes, issuesRes] = await Promise.all([
                getSprintsByProjectApi(projectId),
                getIssuesByProjectApi(projectId)
            ]);

            if (sprintsRes?.EC === 0) setSprints(sprintsRes.data);
            if (issuesRes?.EC === 0) setIssues(issuesRes.data);
        } catch (error) {
            toast.error("An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            fetchData();
        }
    }, [projectId, fetchData]);

    const findContainer = (id) => {
        if (sprints.some(s => s._id === id)) return id;
        const issue = issues.find(i => i._id === id);
        return issue?.sprintId;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer) return;

        // Trường hợp 1: Sắp xếp trong cùng container
        if (activeContainer === overContainer) {
            const activeIndex = issues.findIndex(i => i._id === activeId);
            const overIndex = issues.findIndex(i => i._id === overId);
            if (activeIndex !== overIndex) {
                setIssues(items => arrayMove(items, activeIndex, overIndex));
            }
            return;
        }

        // Trường hợp 2: Di chuyển sang Sprint khác
        setIssues(prevIssues => {
            const newIssues = [...prevIssues];
            const activeIndex = newIssues.findIndex(i => i._id === activeId);
            newIssues[activeIndex] = { ...newIssues[activeIndex], sprintId: overContainer };
            return newIssues;
        });

        const res = await updateIssueApi(activeId, { sprintId: overContainer });
        if (res?.EC !== 0) {
            toast.error("Failed to move issue.");
            fetchData();
        }
    };

    // --- Sprint Handlers ---
    const handleCreateSprint = async () => {
        if (!newSprintName.trim()) return;
        setActionLoading(true);
        try {
            const res = await createSprintApi(projectId, { projectId, name: newSprintName });
            if (res?.EC === 0) {
                toast.success("Sprint created!");
                setNewSprintName("");
                setIsCreating(false);
                fetchData();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenEditModal = (sprint) => { setSelectedSprint(sprint); setEditModalOpen(true); };
    const handleOpenDeleteModal = (sprint) => { setSelectedSprint(sprint); setDeleteModalOpen(true); };
    const handleCloseSprintModals = () => { setEditModalOpen(false); setDeleteModalOpen(false); setSelectedSprint(null); };

    const handleUpdateSprint = async (sprintId, data) => {
        setActionLoading(true);
        try {
            await updateSprintApi(sprintId, data);
            toast.success("Sprint updated!");
            handleCloseSprintModals();
            fetchData();
        } finally { setActionLoading(false); }
    };

    const handleDeleteSprint = async (sprintId) => {
        setActionLoading(true);
        try {
            await deleteSprintApi(sprintId);
            toast.success("Sprint deleted!");
            handleCloseSprintModals();
            fetchData();
        } finally { setActionLoading(false); }
    };

    // --- Issue Handlers ---
    const handleConfirmDeleteIssue = async () => {
        if (!issueToDelete) return;
        setActionLoading(true);
        try {
            const isSubtask = !!issueToDelete.parentId;
            await deleteIssueApi(issueToDelete._id);
            toast.success("Issue deleted!");
            if (selectedIssue?._id === issueToDelete._id) setSelectedIssue(null);
            if (isSubtask) setSubtaskTrigger(prev => prev + 1);
            setIssueToDelete(null);
            fetchData();
        } finally { setActionLoading(false); }
    };

    const backlogSprint = sprints.find(s => s.name === 'Backlog');
    const regularSprints = [...sprints].filter(s => s.name !== 'Backlog').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) return <div className="flex justify-center items-center h-full p-8"><Spinner /></div>;

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 transition-all duration-500 ease-in-out ${selectedIssue ? 'pr-2' : ''}`}>
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Sprints</h2>
                            {!isCreating && (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsCreating(true)} 
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                                >
                                    + Create Sprint
                                </motion.button>
                            )}
                        </div>

                        {/* Regular Sprints */}
                        <div className="space-y-4">
                            {regularSprints.map(sprint => (
                                <SprintContainer
                                    key={sprint._id}
                                    sprint={sprint}
                                    issues={issues.filter(i => i.sprintId === sprint._id)}
                                    project={project}
                                    onEdit={() => handleOpenEditModal(sprint)}
                                    onDelete={() => handleOpenDeleteModal(sprint)}
                                    onIssueSelect={setSelectedIssue}
                                    onOpenDeleteIssueModal={setIssueToDelete}
                                    onDataUpdate={fetchData}
                                />
                            ))}
                        </div>

                        {/* Inline Create Sprint */}
                        <AnimatePresence>
                            {isCreating && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50 shadow-xl"
                                >
                                    <input 
                                        type="text" 
                                        value={newSprintName} 
                                        onChange={(e) => setNewSprintName(e.target.value)} 
                                        placeholder="Sprint Name (e.g. Sprint 1)..." 
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                        autoFocus 
                                    />
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                        <button onClick={handleCreateSprint} disabled={actionLoading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md">
                                            {actionLoading ? <ButtonSpinner /> : 'Create'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Backlog Section */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Project Backlog</h3>
                                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-md text-xs font-bold text-slate-500">
                                    {issues.filter(i => i.sprintId === backlogSprint?._id).length} issues
                                </span>
                            </div>
                            {backlogSprint && (
                                <SprintContainer
                                    sprint={backlogSprint}
                                    issues={issues.filter(i => i.sprintId === backlogSprint._id)}
                                    project={project}
                                    onIssueSelect={setSelectedIssue}
                                    onOpenDeleteIssueModal={setIssueToDelete}
                                    onDataUpdate={fetchData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </DndContext>

            {/* Right Panel - Issue Detail */}
            <AnimatePresence>
                {selectedIssue && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-[450px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-10"
                    >
                        <IssueDetailPanel
                            project={project}
                            issue={selectedIssue}
                            onClose={() => setSelectedIssue(null)}
                            onDataUpdate={fetchData}
                            onDeleteRequest={setIssueToDelete}
                            subtaskTrigger={subtaskTrigger}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <EditSprintModal isOpen={isEditModalOpen} onClose={handleCloseSprintModals} onUpdate={handleUpdateSprint} sprint={selectedSprint} loading={actionLoading} />
            <DeleteSprintModal isOpen={isDeleteModalOpen} onClose={handleCloseSprintModals} onConfirm={handleDeleteSprint} sprint={selectedSprint} loading={actionLoading} />
            <DeleteIssueModal isOpen={!!issueToDelete} onClose={() => setIssueToDelete(null)} onConfirm={handleConfirmDeleteIssue} issue={issueToDelete} loading={actionLoading} />
        </div>
    );
};

export default Backlog;