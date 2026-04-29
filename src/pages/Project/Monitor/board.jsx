import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';

import { getSprintsByProjectApi, completeSprintApi } from '../../../utils/Api/sprintApi';
import { updateIssueApi } from '../../../utils/Api/issueApi';
import { updateBoardColumnsApi } from '../../../utils/Api/projectApi';

import Spinner from '../../../components/Spinner';
import ButtonSpinner from '../../../components/ButtonSpinner';
import BoardColumn from '../../../components/projectPage/Board/BoardColumn';
import IssueCard from '../../../components/projectPage/Board/IssueCard';

// Variants cho hiệu ứng xuất hiện của toàn bộ Board
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Các cột sẽ hiện ra lần lượt
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

const Board = () => {
    const context = useOutletContext();
    const { project, setProject, issues = [], setIssues } = context || {};
    const [activeSprint, setActiveSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [activeElement, setActiveElement] = useState(null);

    const orderedColumns = useMemo(() => {
        if (!project?.boardColumns) return [];
        return project.boardColumns.slice().sort((a, b) => a.order - b.order);
    }, [project?.boardColumns]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    }));

    useEffect(() => {
        const findActiveSprint = async () => {
            if (!project?._id) return;
            setLoading(true);
            try {
                const sprintsRes = await getSprintsByProjectApi(project._id);
                const currentActiveSprint = sprintsRes.data.find(s => s.status === 'active');
                setActiveSprint(currentActiveSprint || null);
            } catch (error) {
                toast.error("Failed to fetch sprints.");
            } finally {
                setLoading(false);
            }
        };
        findActiveSprint();
    }, [project?._id]);

    const issuesByColumn = useMemo(() => {
        const columns = {};
        if (Array.isArray(orderedColumns)) {
            orderedColumns.forEach(col => { columns[col.name] = []; });
        }
        const sprintIssues = activeSprint ? issues.filter(issue => issue.sprintId === activeSprint._id) : issues;
        sprintIssues.forEach(issue => {
            if (columns[issue.status]) columns[issue.status].push(issue);
        });
        return columns;
    }, [issues, orderedColumns, activeSprint]);

    const handleDragStart = (event) => setActiveElement(event.active.data.current);

    const handleDragEnd = async (event) => {
        setActiveElement(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === 'Column' && overType === 'Column') {
            const oldIndex = orderedColumns.findIndex(col => col.name === active.id);
            const newIndex = orderedColumns.findIndex(col => col.name === over.id);
            const newColumnsOrder = arrayMove(orderedColumns, oldIndex, newIndex);
            
            setProject({ ...project, boardColumns: newColumnsOrder.map((col, i) => ({ ...col, order: i + 1 })) });
            try {
                await updateBoardColumnsApi(project._id, { 
                    boardColumns: newColumnsOrder.map((col, i) => ({ _id: col._id, name: col.name, order: i + 1 })) 
                });
            } catch { setProject(project); }
        }

        if (activeType === 'Issue') {
            const newStatus = overType === 'Column' ? over.id : over.data.current?.issue?.status;
            if (newStatus && active.data.current.issue.status !== newStatus) {
                setIssues(issues.map(i => i._id === active.id ? { ...i, status: newStatus } : i));
                try {
                    await updateIssueApi(active.id, { status: newStatus });
                } catch { setIssues(issues); }
            }
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="h-full flex flex-col p-6 space-y-6 overflow-hidden"
            >
                {/* Header Section */}
                <motion.header variants={itemVariants} className="flex justify-between items-end">
                    <div>
                        <motion.h1 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-3xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                            {activeSprint?.name || 'Board Overview'}
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Track progress and coordinate tasks in real-time.
                        </p>
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
                                    onClick={() => {/* logic */}}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    Complete Sprint
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.header>

                {/* Board Columns */}
                <motion.main variants={itemVariants} className="flex-grow overflow-x-auto custom-scrollbar pb-6">
                    <div className="flex gap-6 h-full min-w-max">
                        <SortableContext items={orderedColumns.map(c => c.name)} strategy={horizontalListSortingStrategy}>
                            <LayoutGroup>
                                {orderedColumns.map(column => (
                                    <motion.div 
                                        layout
                                        key={column.name}
                                        className="h-full"
                                    >
                                        <BoardColumn
                                            column={column}
                                            issues={issuesByColumn[column.name] || []}
                                            onIssueClick={(issue) => console.log(issue)}
                                        />
                                    </motion.div>
                                ))}
                            </LayoutGroup>
                        </SortableContext>
                    </div>
                </motion.main>
            </motion.div>

            {/* Drag Overlay - Hiệu ứng mượt khi nhấc vật thể */}
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
    );
};

export default Board;