import { useState, useEffect, useCallback } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getSprintsByProjectApi, createSprintApi, updateSprintApi, deleteSprintApi, startSprintApi, completeSprintApi } from '../../../../utils/Api/sprintApi';
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
    const [issues, setIssues] = useState([]); // Quản lý tất cả issues ở đây

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
            activationConstraint: {
                distance: 8, // Chỉ bắt đầu kéo sau khi di chuyển chuột 8px
            },
        })
    );

    // Hàm fetch dữ liệu tập trung
    const fetchData = useCallback(async () => {
        try {
            const [sprintsRes, issuesRes] = await Promise.all([
                getSprintsByProjectApi(projectId),
                getIssuesByProjectApi(projectId)
            ]);

            if (sprintsRes && sprintsRes.EC === 0) {
                setSprints(sprintsRes.data);
            } else {
                toast.error(sprintsRes.EM || "Failed to fetch sprints.");
            }

            if (issuesRes && issuesRes.EC === 0) {
                setIssues(issuesRes.data);
            } else {
                toast.error(issuesRes.EM || "Failed to fetch issues.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while fetching data.");
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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return; // Không thả vào khu vực hợp lệ

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            // Logic sắp xếp trong cùng 1 sprint (nếu cần)
            if (activeContainer && overContainer && activeContainer === overContainer) {
                const activeIndex = issues.findIndex(i => i._id === activeId);
                const overIndex = issues.findIndex(i => i._id === overId);
                if (activeIndex !== overIndex) {
                    setIssues(items => arrayMove(items, activeIndex, overIndex));
                }
            }
            return;
        }

        // Logic di chuyển giữa các sprint
        setIssues(prevIssues => {
            const activeIndex = prevIssues.findIndex(i => i._id === activeId);
            prevIssues[activeIndex].sprintId = overContainer;
            return [...prevIssues];
        });

        // Gọi API
        const res = await updateIssueApi(activeId, { sprintId: overContainer });
        if (res && res.EC === 0) {
            toast.success(res.EM || "Issue moved successfully!");
            fetchData();
        } else {
            toast.error(res.EM || "Failed to move issue.");
            fetchData();
        }
    };

    const findContainer = (id) => {
        if (sprints.some(s => s._id === id)) {
            return id;
        }
        const issue = issues.find(i => i._id === id);
        return issue?.sprintId;
    };

    // --- Các hàm xử lý Sprint ---
    const handleCreateSprint = async () => {
        if (!newSprintName.trim()) return;
        setActionLoading(true);
        try {
            const sprintData = { projectId, name: newSprintName };
            const res = await createSprintApi(projectId, sprintData);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Sprint created!");
                setNewSprintName("");
                setIsCreating(false);
                fetchData(); // Tải lại toàn bộ dữ liệu
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
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
            const res = await updateSprintApi(sprintId, data);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Sprint updated!");
            } else {
                toast.error(res.EM || "Failed to update sprint.");
            }
            handleCloseSprintModals();
            fetchData();
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSprint = async (sprintId) => {
        setActionLoading(true);
        try {
            const res = await deleteSprintApi(sprintId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Sprint deleted!");
            } else {
                toast.error(res.EM || "Failed to delete sprint.");
            }
            handleCloseSprintModals();
            fetchData();
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            const res = await startSprintApi(sprintId);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                fetchData();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to start sprint.");
        }
    };

    const handleCompleteSprint = async (sprintId) => {
        try {
            const res = await completeSprintApi(sprintId);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                fetchData();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to complete sprint.");
        }
    };


    // --- Các hàm xử lý Issue ---
    const handleDataUpdate = () => {
        fetchData(); // Hàm chung để tải lại toàn bộ dữ liệu
    };

    const handleOpenDeleteIssueModal = (issue) => {
        setIssueToDelete(issue);
    };

    const handleConfirmDeleteIssue = async () => {
        if (!issueToDelete) return;
        setActionLoading(true);
        try {
            const isSubtask = !!issueToDelete.parentId;

            const res = await deleteIssueApi(issueToDelete._id);
            toast.success(res.EM || "Issue deleted!");
            setIssueToDelete(null);
            if (selectedIssue?._id === issueToDelete._id) {
                setSelectedIssue(null);
            }

            if (isSubtask) {
                setSubtaskTrigger(prev => prev + 1);
            }
            fetchData();
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        } finally {
            setActionLoading(false);
        }
    };

    // Tách sprints ra để render
    const backlogSprint = sprints.find(s => s.name === 'Backlog');
    const regularSprints = sprints
        .filter(s => s.name !== 'Backlog' && s.status !== 'completed')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Spinner /></div>;
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex h-full">
                    <div className={`p-4 transition-all duration-300 ease-in-out ${selectedIssue ? 'w-2/3' : 'w-full'}`}>
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
                                    onOpenDeleteIssueModal={handleOpenDeleteIssueModal}
                                    onDataUpdate={handleDataUpdate}
                                    onStartSprint={handleStartSprint}
                                    onCompleteSprint={handleCompleteSprint}
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            {isCreating ? (
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <input type="text" value={newSprintName} onChange={(e) => setNewSprintName(e.target.value)} placeholder="Enter sprint name..." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" autoFocus />
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Cancel</button>
                                        <button onClick={handleCreateSprint} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center cursor-pointer w-24">
                                            {actionLoading ? <ButtonSpinner /> : 'Create'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setIsCreating(true)} className="w-full px-4 py-2 text-sm font-medium text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer">
                                    + Create Sprint
                                </button>
                            )}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Backlog</h3>
                            {backlogSprint ? (
                                <SprintContainer
                                    sprint={backlogSprint}
                                    issues={issues.filter(i => i.sprintId === backlogSprint._id)}
                                    project={project}
                                    onIssueSelect={setSelectedIssue}
                                    onOpenDeleteIssueModal={handleOpenDeleteIssueModal}
                                    onDataUpdate={handleDataUpdate}
                                />
                            ) : (
                                <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                                    <p>Your backlog is empty.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedIssue && (
                        <div className="w-1/3 flex-shrink-0">
                            <IssueDetailPanel
                                project={project}
                                issue={selectedIssue}
                                onClose={() => setSelectedIssue(null)}
                                onDataUpdate={handleDataUpdate}
                                onDeleteRequest={handleOpenDeleteIssueModal}
                                subtaskTrigger={subtaskTrigger}
                            />
                        </div>
                    )}
                </div>
            </DndContext>

            {/* Modals */}
            {
                selectedSprint && (
                    <>
                        <EditSprintModal isOpen={isEditModalOpen} onClose={handleCloseSprintModals} onUpdate={handleUpdateSprint} sprint={selectedSprint} loading={actionLoading} />
                        <DeleteSprintModal isOpen={isDeleteModalOpen} onClose={handleCloseSprintModals} onConfirm={handleDeleteSprint} sprint={selectedSprint} loading={actionLoading} />
                    </>
                )
            }
            <DeleteIssueModal isOpen={!!issueToDelete} onClose={() => setIssueToDelete(null)} onConfirm={handleConfirmDeleteIssue} issue={issueToDelete} loading={actionLoading} />
        </>
    );
};

export default Backlog;