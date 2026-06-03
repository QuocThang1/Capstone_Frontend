import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';
import { GitBranch } from 'lucide-react';

import { getSprintsByProjectApi, completeSprintApi } from '../../../../utils/Api/sprintApi';
import { updateIssueApi } from '../../../../utils/Api/issueApi';
import { updateBoardColumnsApi } from '../../../../utils/Api/projectApi';

import Spinner from '../../../../components/Spinner';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import IssueDetailModal from './issueDetailModal';
import BoardColumn from '../../../../components/projectPage/Board/BoardColumn';
import IssueCard from '../../../../components/projectPage/Board/IssueCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Board = () => {
    const context = useOutletContext();
    const navigate = useNavigate();
    const { project, setProject, issues = [], setIssues, fetchIssuesData } = context || {};

    const [activeSprint, setActiveSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [activeElement, setActiveElement] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const orderedColumns = useMemo(() => {
        if (!project?.boardColumns) return [];
        return project.boardColumns.slice().sort((a, b) => a.order - b.order);
    }, [project?.boardColumns]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    }));

    useEffect(() => {
        const findActiveSprint = async () => {
            if (!project?._id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const sprintsRes = await getSprintsByProjectApi(project._id);
                const currentActiveSprint = sprintsRes.data.find(s => s.status === 'active');
                setActiveSprint(currentActiveSprint || null);
            } catch (error) {
                toast.error(error.response?.data?.EM || "Failed to fetch sprints.");
            } finally {
                setLoading(false);
            }
        };
        findActiveSprint();
    }, [project?._id]);

    useEffect(() => {
        if (selectedIssue) {
            const updatedIssue = issues.find(i => i._id === selectedIssue._id);
            // Nếu có bản cập nhật mới nhất từ backend, thay thế dữ liệu đang hiển thị trên Modal
            if (updatedIssue && JSON.stringify(updatedIssue) !== JSON.stringify(selectedIssue)) {
                setSelectedIssue(updatedIssue);
            }
        }
    }, [issues]);

    const getSprintId = (issue) => issue?.sprintId?._id || issue?.sprintId || null;

    const sprintIssues = useMemo(() => {
        if (!activeSprint) return [];
        return issues.filter(issue => getSprintId(issue) === activeSprint._id && !issue.parentId);
    }, [issues, activeSprint]);

    const issuesByColumn = useMemo(() => {
        const columns = {};
        if (Array.isArray(orderedColumns)) {
            orderedColumns.forEach(col => { columns[col.name] = []; });
        }
        sprintIssues.forEach(issue => {
            if (columns[issue.status]) columns[issue.status].push(issue);
        });
        return columns;
    }, [sprintIssues, orderedColumns]);

    const handleDragStart = (event) => setActiveElement(event.active.data.current);

    const handleDragEnd = async (event) => {
        setActiveElement(null);
        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        // Kéo thả để sắp xếp lại CỘT
        if (activeType === 'Column' && overType === 'Column') {
            const oldIndex = orderedColumns.findIndex(col => col.name === active.id);
            const newIndex = orderedColumns.findIndex(col => col.name === over.id);

            if (oldIndex !== newIndex) {
                const newOrder = arrayMove(orderedColumns, oldIndex, newIndex);
                const originalProject = { ...project };
                setProject({ ...project, boardColumns: newOrder.map((col, i) => ({ ...col, order: i + 1 })) });

                try {
                    await updateBoardColumnsApi(project._id, {
                        boardColumns: newOrder.map((col, i) => ({ _id: col._id, name: col.name, order: i + 1 }))
                    });
                } catch {
                    setProject(originalProject);
                    toast.error("Failed to update board order.");
                }
            }
            return;
        }

        // Kéo ISSUE (Vào Cột hoặc lên một Issue khác)
        if (activeType === 'Issue') {
            const issueToMove = active.data.current.issue;
            let destinationColumnName = null;

            if (overType === 'Column') {
                destinationColumnName = over.data.current.column.name;
            } else if (overType === 'Issue') {
                destinationColumnName = over.data.current.issue.status;
            }

            if (!destinationColumnName) return;

            // NẾU KÉO SANG CỘT KHÁC
            if (issueToMove.status !== destinationColumnName) {
                const originalIssues = [...issues];

                setIssues(prevIssues => {
                    const updatedList = prevIssues.map(issue =>
                        issue._id === active.id ? { ...issue, status: destinationColumnName } : issue
                    );

                    if (overType === 'Issue') {
                        const oldIndex = updatedList.findIndex(i => i._id === active.id);
                        const newIndex = updatedList.findIndex(i => i._id === over.id);
                        if (oldIndex !== -1 && newIndex !== -1) {
                            return arrayMove(updatedList, oldIndex, newIndex);
                        }
                    }
                    return updatedList;
                });

                try {
                    const res = await updateIssueApi(active.id, { status: destinationColumnName });
                    if (res && res.EC === 0) {
                        toast.success(`Issue moved to "${destinationColumnName}"`);
                        fetchIssuesData();
                    } else {
                        setIssues(originalIssues);
                        toast.error(res.EM || "Failed to update issue status.");
                    }
                } catch (error) {
                    setIssues(originalIssues);
                    const errorMessage = error.response?.data?.EM || error.message || "An unexpected error occurred.";
                    toast.error(errorMessage);
                }

            }
            // NẾU KÉO TRONG CÙNG 1 CỘT 
            else {
                if (active.id !== over.id) {
                    setIssues(prevIssues => {
                        const oldIndex = prevIssues.findIndex(i => i._id === active.id);
                        const newIndex = prevIssues.findIndex(i => i._id === over.id);
                        if (oldIndex !== -1 && newIndex !== -1) {
                            return arrayMove(prevIssues, oldIndex, newIndex);
                        }
                        return prevIssues;
                    });
                }
            }
        }
    };

    const handleCompleteSprint = async () => {
        if (!activeSprint) return;
        setIsCompleting(true);
        try {
            const res = await completeSprintApi(activeSprint._id);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Sprint completed successfully!");
                setActiveSprint(null);
                if (fetchIssuesData) fetchIssuesData();
            } else {
                toast.error(res.EM || "Failed to complete sprint.");
            }
        } catch (error) {
            toast.error(error.response?.data?.EM || "Failed to complete sprint.");
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>;

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-full min-h-[700px] flex flex-col p-6 space-y-6 overflow-hidden"
                >
                    <motion.header variants={itemVariants} className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {activeSprint ? activeSprint.name : 'Board Overview'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                {activeSprint
                                    ? 'Track progress and coordinate tasks in real-time.'
                                    : <>Go to the <button onClick={() => navigate(`/projects/${project._id}/backlog`)} className="text-indigo-500 hover:underline">Backlog</button> to start a sprint.</>
                                }
                            </p>
                            {project?.activeWorkflowId?.name && (
                                <>
                                    <span className="text-slate-300 dark:text-slate-600">|</span>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                        <GitBranch className="w-6 h-6 text-indigo-500" />
                                        Process flow:
                                        <span className="font-bold text-slate-600 dark:text-slate-300">{project.activeWorkflowId.name}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <AnimatePresence>
                                {activeSprint && (
                                    <motion.button
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCompleteSprint}
                                        disabled={isCompleting}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:bg-indigo-400 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {isCompleting ? <ButtonSpinner /> : (
                                            <>
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                </span>
                                                Complete Sprint
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.header>

                    <motion.main variants={itemVariants} className="flex-grow overflow-x-auto custom-scrollbar pb-6">
                        <div className="flex gap-6 h-full min-w-max">
                            <SortableContext items={orderedColumns.map(c => c.name)} strategy={horizontalListSortingStrategy}>
                                <LayoutGroup>
                                    {orderedColumns.map(column => (
                                        <motion.div layout key={column.name} className="h-full">
                                            <BoardColumn
                                                column={column}
                                                issues={issuesByColumn[column.name] || []}
                                                onIssueClick={(issue) => setSelectedIssue(issue)}
                                            />
                                        </motion.div>
                                    ))}
                                </LayoutGroup>
                            </SortableContext>
                        </div>
                    </motion.main>
                </motion.div>

                <DragOverlay dropAnimation={{ duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeElement && (
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{
                                scale: 1.05,
                                rotate: activeElement.type === 'Column' ? 2 : 1,
                                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                            }}
                        >
                            {activeElement.type === 'Column' ? (
                                <BoardColumn column={activeElement.column} issues={issuesByColumn[activeElement.column.name] || []} />
                            ) : (
                                <IssueCard issue={activeElement.issue} />
                            )}
                        </motion.div>
                    )}
                </DragOverlay>
            </DndContext>
            {selectedIssue && (
                <IssueDetailModal
                    project={project}
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onDataUpdate={fetchIssuesData}
                />
            )}
        </>
    );
};

export default Board;