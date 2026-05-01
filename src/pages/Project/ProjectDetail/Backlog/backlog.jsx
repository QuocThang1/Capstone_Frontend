import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { getSprintsByProjectApi, createSprintApi, updateSprintApi, deleteSprintApi, startSprintApi, completeSprintApi } from '../../../../utils/Api/sprintApi';
import { deleteIssueApi, updateIssueApi } from '../../../../utils/Api/issueApi';

import Spinner from '../../../../components/spinner';
import SprintContainer from '../../../../components/projectPage/Backlog/sprintContainer';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import EditSprintModal from './Sprint/editSprintModal';
import DeleteSprintModal from './Sprint/deleteSprintModal';
import IssueDetailPanel from './Issue/issueDetailPanel';
import DeleteIssueModal from './Issue/deleteIssueModal';

// Thêm variants animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};


const Backlog = () => {
    const context = useOutletContext();
    const { project, issues = [], setIssues, fetchIssuesData } = context || {};

    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [newSprintName, setNewSprintName] = useState("");
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueToDelete, setIssueToDelete] = useState(null);
    const [subtaskTrigger, setSubtaskTrigger] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const fetchSprints = useCallback(async () => {
        if (!project?._id) return;
        try {
            const sprintsRes = await getSprintsByProjectApi(project._id);
            if (sprintsRes?.EC === 0) setSprints(sprintsRes.data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch sprints.");
        } finally {
            setLoading(false);
        }
    }, [project?._id]);

    useEffect(() => {
        setLoading(true);
        fetchSprints();
    }, [fetchSprints]);

    const handleDataUpdate = () => {
        fetchSprints();
        if (fetchIssuesData) fetchIssuesData();
    };

    const findContainer = (id) => {
        if (sprints.some(s => s._id === id)) return id;
        const issue = issues.find(i => i._id === id);
        return issue?.sprintId;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer) return;

        if (activeContainer === overContainer) {
            const activeIndex = issues.findIndex(i => i._id === active.id);
            const overIndex = issues.findIndex(i => i._id === over.id);
            if (activeIndex !== overIndex) {
                setIssues(items => arrayMove(items, activeIndex, overIndex));
            }
            return;
        }

        const originalIssues = [...issues];
        const updatedIssues = issues.map(issue =>
            issue._id === active.id ? { ...issue, sprintId: overContainer } : issue
        );
        setIssues(updatedIssues);

        try {
            await updateIssueApi(active.id, { sprintId: overContainer });
        } catch (error) {
            setIssues(originalIssues);
            toast.error(error.message || "Failed to move issue.");
        }
    };

    const handleCreateSprint = async () => {
        if (!newSprintName.trim()) return;
        setActionLoading(true);
        try {
            const res = await createSprintApi(project._id, { name: newSprintName });
            if (res?.EC === 0) {
                toast.success("Sprint created!");
                setNewSprintName("");
                setIsCreating(false);
                fetchSprints();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateSprint = async (sprintId, data) => {
        setActionLoading(true);
        try {
            await updateSprintApi(sprintId, data);
            toast.success("Sprint updated!");
            handleCloseSprintModals();
            fetchSprints();
        } finally { setActionLoading(false); }
    };

    const handleDeleteSprint = async (sprintId) => {
        setActionLoading(true);
        try {
            await deleteSprintApi(sprintId);
            toast.success("Sprint deleted!");
            handleCloseSprintModals();
            handleDataUpdate();
        } finally { setActionLoading(false); }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            const res = await startSprintApi(sprintId);
            if (res?.EC === 0) toast.success(res.EM);
            else toast.error(res.EM || "Failed to start sprint.");
            fetchSprints();
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to start sprint.");
        }
    };

    const handleCompleteSprint = async (sprintId) => {
        try {
            const res = await completeSprintApi(sprintId);
            if (res?.EC === 0) toast.success(res.EM);
            else toast.error(res.EM || "Failed to complete sprint.");
            fetchSprints();
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to complete sprint.");
        }
    };

    const handleOpenEditModal = (sprint) => { setSelectedSprint(sprint); setEditModalOpen(true); };
    const handleOpenDeleteModal = (sprint) => { setSelectedSprint(sprint); setDeleteModalOpen(true); };
    const handleCloseSprintModals = () => { setEditModalOpen(false); setDeleteModalOpen(false); setSelectedSprint(null); };

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
            if (fetchIssuesData) fetchIssuesData();
        } finally { setActionLoading(false); }
    };

    const backlogSprint = useMemo(() => sprints.find(s => s.name === 'Backlog'), [sprints]);
    const regularSprints = useMemo(() =>
        sprints
            .filter(s => s.name !== 'Backlog' && s.status !== 'completed')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [sprints]
    );

    if (loading) return <div className="flex justify-center items-center h-full p-8"><Spinner /></div>;

    return (
        <>
            <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <motion.div
                        className="flex-1 overflow-y-auto custom-scrollbar p-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="max-w-5xl mx-auto space-y-6">
                            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Sprints</h2>
                                {!isCreating && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsCreating(true)}
                                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
                                    >
                                        + Create Sprint
                                    </motion.button>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-4">
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
                                        onDataUpdate={handleDataUpdate}
                                        onStartSprint={handleStartSprint}
                                        onCompleteSprint={handleCompleteSprint}
                                    />
                                ))}
                            </motion.div>

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
                                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 cursor-pointer">Cancel</button>
                                            <button onClick={handleCreateSprint} disabled={actionLoading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                                                {actionLoading ? <ButtonSpinner /> : 'Create'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
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
                                        onDataUpdate={handleDataUpdate}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </DndContext>

                <AnimatePresence>
                    {selectedIssue && (
                        <IssueDetailPanel
                            project={project}
                            issue={selectedIssue}
                            onClose={() => setSelectedIssue(null)}
                            onDataUpdate={handleDataUpdate}
                            onDeleteRequest={setIssueToDelete}
                            subtaskTrigger={subtaskTrigger}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Modals remain outside the flex layout */}
            <EditSprintModal isOpen={isEditModalOpen} onClose={handleCloseSprintModals} onUpdate={handleUpdateSprint} sprint={selectedSprint} loading={actionLoading} />
            <DeleteSprintModal isOpen={isDeleteModalOpen} onClose={handleCloseSprintModals} onConfirm={handleDeleteSprint} sprint={selectedSprint} loading={actionLoading} />
            <DeleteIssueModal isOpen={!!issueToDelete} onClose={() => setIssueToDelete(null)} onConfirm={handleConfirmDeleteIssue} issue={issueToDelete} loading={actionLoading} />
        </>
    );
};

export default Backlog;