import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';

import { getSprintsByProjectApi, completeSprintApi } from '../../../../utils/Api/sprintApi';
import { updateIssueApi } from '../../../../utils/Api/issueApi';
import { updateBoardColumnsApi } from '../../../../utils/Api/projectApi';

import Spinner from '../../../../components/spinner';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import BoardColumn from '../../../../components/projectPage/Board/BoardColumn';
import IssueCard from '../../../../components/projectPage/Board/IssueCard';

const Board = () => {
    const { project, setProject, issues, setIssues, fetchIssuesData } = useOutletContext();
    const navigate = useNavigate();

    const [activeSprint, setActiveSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [activeElement, setActiveElement] = useState(null);

    const orderedColumns = useMemo(() => {
        return project.boardColumns?.slice().sort((a, b) => a.order - b.order) || [];
    }, [project.boardColumns]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    }));

    useEffect(() => {
        fetchIssuesData();
        const findActiveSprint = async () => {
            if (!project?._id) return;
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

    const sprintIssues = useMemo(() => {
        if (!activeSprint) return [];
        return issues.filter(issue => issue.sprintId === activeSprint._id);
    }, [issues, activeSprint]);

    const issuesByColumn = useMemo(() => {
        const columns = {};
        if (Array.isArray(orderedColumns)) {
            orderedColumns.forEach(col => {
                columns[col.name] = [];
            });
        }
        sprintIssues.forEach(issue => {
            if (columns[issue.status]) {
                columns[issue.status].push(issue);
            }
        });
        return columns;
    }, [sprintIssues, orderedColumns]);

    const handleDragStart = (event) => {
        setActiveElement(event.active.data.current);
    };

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
            const updatedProject = {
                ...project,
                boardColumns: newColumnsOrder.map((col, index) => ({ ...col, order: index + 1 }))
            };
            setProject(updatedProject);

            try {
                const columnsToUpdate = newColumnsOrder.map((col, index) => ({
                    _id: col._id,
                    name: col.name,
                    order: index + 1
                }));
                await updateBoardColumnsApi(project._id, { boardColumns: columnsToUpdate });
            } catch (error) {
                setProject(project);
                toast.error(error.response?.data?.EM || "Failed to update board order.");
            }
            return;
        }

        if (activeType === 'Issue' && overType === 'Column') {
            const issue = active.data.current.issue;
            const newStatus = over.data.current.column.name;

            if (issue.status !== newStatus) {
                const originalIssues = [...issues];
                const updatedIssues = issues.map(i =>
                    i._id === active.id ? { ...i, status: newStatus } : i
                );
                setIssues(updatedIssues);

                try {
                    await updateIssueApi(active.id, { status: newStatus });
                    toast.success(`Issue moved to "${newStatus}"`);
                } catch (error) {
                    setIssues(originalIssues);
                    toast.error(error.response?.data?.EM || "Failed to update issue status.");
                }
            }
        }
    };

    const handleCompleteSprint = async () => {
        if (!activeSprint) return;
        setIsCompleting(true);
        try {
            const res = await completeSprintApi(activeSprint._id);
            toast.success(res.EM || "Sprint completed successfully!");

            const sprintsRes = await getSprintsByProjectApi(project._id);
            const currentActiveSprint = sprintsRes.data.find(s => s.status === 'active');
            setActiveSprint(currentActiveSprint || null);
            fetchIssuesData();
        } catch (error) {
            toast.error(error.response?.data?.EM || "Failed to complete sprint.");
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Spinner /></div>;
    }

    if (!activeSprint) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No active sprint</h3>
                <p className="text-slate-500">Go to the <button onClick={() => navigate(`/projects/${project._id}/backlog`)} className="text-indigo-600 dark:text-indigo-400 hover:underline">Backlog</button> to start a sprint.</p>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold">{activeSprint.name}</h2>
                    <button
                        onClick={handleCompleteSprint}
                        className={`px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 ${isCompleting ? 'opacity-70' : ''}`}
                        disabled={isCompleting}
                    >
                        {isCompleting ? <ButtonSpinner /> : 'Complete Sprint'}
                    </button>
                </div>
                <div className="flex-grow overflow-x-auto">
                    <div className="flex gap-4 h-full">
                        <SortableContext items={orderedColumns.map(c => c.name)} strategy={horizontalListSortingStrategy}>
                            {orderedColumns.map(column => (
                                <BoardColumn
                                    key={column.name}
                                    column={column}
                                    issues={issuesByColumn[column.name] || []}
                                    onIssueClick={(issue) => console.log("Issue clicked:", issue)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeElement?.type === 'Column' && <BoardColumn column={activeElement.column} issues={issuesByColumn[activeElement.column.name] || []} />}
                {activeElement?.type === 'Issue' && <IssueCard issue={activeElement.issue} />}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;