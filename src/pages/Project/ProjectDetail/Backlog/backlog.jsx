import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, KeyboardSensor, MeasuringStrategy } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { getSprintsByProjectApi, createSprintApi, updateSprintApi, deleteSprintApi, startSprintApi, completeSprintApi } from '../../../../utils/Api/sprintApi';
import { deleteIssueApi, updateIssueApi } from '../../../../utils/Api/issueApi';
import { containerVariants, itemVariants, buttonVariants } from '../../../../utils/motionVariants';

import Spinner from '../../../../components/spinner';
import SprintContainer from '../../../../components/projectPage/Backlog/sprintContainer';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import EditSprintModal from './Sprint/editSprintModal';
import DeleteSprintModal from './Sprint/deleteSprintModal';
import IssueDetailPanel from './Issue/issueDetailPanel';
import DeleteIssueModal from './Issue/deleteIssueModal';


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
            activationConstraint: {
                distance: 5 // Khoảng cách nhỏ để tránh kéo nhầm khi click 
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getSprintId = (issue) => issue?.sprintId?._id || issue?.sprintId || null;

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

    useEffect(() => {
        if (selectedIssue) {
            const updatedIssue = issues.find(i => i._id === selectedIssue._id);
            if (updatedIssue && JSON.stringify(updatedIssue) !== JSON.stringify(selectedIssue)) {
                setSelectedIssue(updatedIssue);
            }
        }
    }, [issues]);

    const handleDataUpdate = () => {
        fetchSprints();
        fetchIssuesData();
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
                toast.success(res.EM || "Sprint created!");
                setNewSprintName("");
                setIsCreating(false);
                fetchSprints();
            } else {
                toast.error(res.EM || "Failed to create sprint.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateSprint = async (sprintId, data) => {
        setActionLoading(true);
        try {
            const res = await updateSprintApi(sprintId, data);
            if (res?.EC === 0) {
                toast.success(res.EM || "Sprint updated!");
                handleCloseSprintModals();
                fetchSprints();
            } else {
                toast.error(res.EM || "Failed to update sprint.");
            }
        } finally { setActionLoading(false); }
    };

    const handleDeleteSprint = async (sprintId) => {
        setActionLoading(true);
        try {
            const res = await deleteSprintApi(sprintId);
            if (res?.EC === 0) {
                toast.success(res.EM || "Sprint deleted!");
                handleCloseSprintModals();
                handleDataUpdate();
            } else {
                toast.error(res.EM || "Failed to delete sprint.");
            }
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
            if (res && res.EC === 0) {
                toast.success(res.EM || "Sprint completed successfully!");
                fetchSprints();
                fetchIssuesData();
            } else {
                toast.error(res.EM || "Failed to complete sprint.");
            }
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
            fetchIssuesData();
        } finally { setActionLoading(false); }
    };

    const backlogSprint = useMemo(() => sprints.find(s => s.name === 'Backlog'), [sprints]);
    const regularSprints = useMemo(() =>
        sprints
            .filter(s => s.name !== 'Backlog' && s.status !== 'completed')
            .sort((a, b) => {
                if (a.status === 'active' && b.status !== 'active') return -1;
                if (b.status === 'active' && a.status !== 'active') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            }),
        [sprints]
    );

    if (loading) return <div className="flex justify-center items-center h-full p-8"><Spinner /></div>;

    return (
        <>
            <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
                    measuring={{
                        droppable: {
                            strategy: MeasuringStrategy.Always,
                        },
                    }}
                    autoScroll={{
                        canScroll: (element) => {
                            return element.id === 'backlog-scroll-container' || element === window;
                        },
                        layoutShiftCompensation: {
                            x: false,
                            y: true
                        },
                    }}>
                    <motion.div
                        id="backlog-scroll-container"
                        className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden "
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ height: '100%', minHeight: 0 }}
                    >
                        <div className="mx-auto space-y-6">
                            <motion.header variants={itemVariants} className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Sprint Planning</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Organize and manage sprint tasks, priorities, and delivery schedules.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!isCreating && (
                                        <motion.button
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            onClick={() => setIsCreating(true)}
                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all cursor-pointer"
                                        >
                                            + Create Sprint
                                        </motion.button>
                                    )}
                                </div>
                            </motion.header>

                            <motion.section variants={itemVariants} className="space-y-4">
                                {regularSprints.map(sprint => (
                                    <SprintContainer
                                        key={sprint._id}
                                        sprint={sprint}
                                        issues={issues.filter(i => getSprintId(i) === sprint._id && !i.parentId)}
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
                            </motion.section>

                            <AnimatePresence>
                                {isCreating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-900/50 shadow-xl"
                                    >
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">New Sprint</p>
                                        <input
                                            type="text"
                                            value={newSprintName}
                                            onChange={(e) => setNewSprintName(e.target.value)}
                                            placeholder="Enter sprint name (e.g. Sprint 1, Q2 Release)..."
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-3 mt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setIsCreating(false)}
                                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={handleCreateSprint}
                                                disabled={actionLoading}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            >
                                                {actionLoading ? <ButtonSpinner /> : 'Create Sprint'}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.section variants={itemVariants} className="mt-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Product Backlog</h2>
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300"
                                        >
                                            {issues.filter(i => i.sprintId === backlogSprint?._id).length}
                                        </motion.span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Issues ready for planning</p>
                                </div>
                            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Project Backlog</h3>
                                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-md text-xs font-bold text-slate-500">
                                        {issues.filter(i => getSprintId(i) === backlogSprint?._id && !i.parentId).length} issues
                                    </span>
                                </div>
                                {backlogSprint && (
                                    <SprintContainer
                                        sprint={backlogSprint}
                                        issues={issues.filter(i => getSprintId(i) === backlogSprint._id && !i.parentId)}
                                        project={project}
                                        onIssueSelect={setSelectedIssue}
                                        onOpenDeleteIssueModal={setIssueToDelete}
                                        onDataUpdate={handleDataUpdate}
                                    />
                                )}
                            </motion.div>
                            </motion.section>
                        </div>
                    </motion.div>
                </DndContext>

                <AnimatePresence>
                    {selectedIssue && (
                        <IssueDetailPanel
                            project={project}
                            sprints={sprints}
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
            <EditSprintModal isOpen={isEditModalOpen} onClose={handleCloseSprintModals} onUpdate={handleUpdateSprint} sprint={selectedSprint} loading={actionLoading} projectId={project?._id} />
            <DeleteSprintModal isOpen={isDeleteModalOpen} onClose={handleCloseSprintModals} onConfirm={handleDeleteSprint} sprint={selectedSprint} loading={actionLoading} />
            <DeleteIssueModal isOpen={!!issueToDelete} onClose={() => setIssueToDelete(null)} onConfirm={handleConfirmDeleteIssue} issue={issueToDelete} loading={actionLoading} />
        </>
    );
};

export default Backlog;
