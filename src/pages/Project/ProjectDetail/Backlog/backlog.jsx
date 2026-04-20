import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getSprintsByProjectApi, createSprintApi, updateSprintApi, deleteSprintApi } from '../../../../utils/Api/sprintApi';
import { toast } from 'react-toastify';
import Spinner from '../../../../components/spinner';
import SprintContainer from '../../../../components/projectPage/Backlog/sprintContainer';
import ButtonSpinner from '../../../../components/ButtonSpinner';
import EditSprintModal from './editSprintModal';
import DeleteSprintModal from './deleteSprintModal';

const Backlog = () => {
    const { projectId } = useParams();
    const { project } = useOutletContext();
    const [regularSprints, setRegularSprints] = useState([]);
    const [backlogSprint, setBacklogSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newSprintName, setNewSprintName] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);


    // ... (các hàm fetchSprints, useEffect, handleCreateSprint giữ nguyên)
    const fetchSprints = async () => {
        try {
            setLoading(true);
            const res = await getSprintsByProjectApi(projectId);
            if (res && res.EC === 0) {
                // Lọc để tách riêng sprint "Backlog" và các sprint khác
                const backlog = res.data.find(s => s.name === 'Backlog');
                const regulars = res.data.filter(s => s.name !== 'Backlog');

                setBacklogSprint(backlog);
                setRegularSprints(regulars);
            } else {
                toast.error(res.EM || "Failed to fetch sprints.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while fetching sprints.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchSprints();
        }
    }, [projectId]);

    const handleCreateSprint = async () => {
        if (!newSprintName.trim()) {
            toast.warn("Sprint name cannot be empty.");
            return;
        }
        setActionLoading(true);
        try {
            const res = await createSprintApi(projectId, { name: newSprintName });
            if (res && res.EC === 0) {
                toast.success("Sprint created successfully!");
                setNewSprintName("");
                setIsCreating(false);
                fetchSprints(); // Tải lại danh sách sprint
            } else {
                toast.error(res.EM || "Failed to create sprint.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenEditModal = (sprint) => {
        setSelectedSprint(sprint);
        setEditModalOpen(true);
    };

    const handleOpenDeleteModal = (sprint) => {
        setSelectedSprint(sprint);
        setDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedSprint(null);
    };

    const handleUpdateSprint = async (sprintId, data) => {
        setActionLoading(true);
        try {
            const res = await updateSprintApi(sprintId, data);
            if (res && res.EC === 0) {
                toast.success("Sprint updated successfully!");
                handleCloseModals();
                fetchSprints();
            } else {
                toast.error(res.EM || "Failed to update sprint.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSprint = async (sprintId) => {
        setActionLoading(true);
        try {
            const res = await deleteSprintApi(sprintId);
            if (res && res.EC === 0) {
                toast.success("Sprint deleted successfully!");
                handleCloseModals();
                fetchSprints();
            } else {
                toast.error(res.EM || "Failed to delete sprint.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Spinner /></div>;
    }

    return (
        <div className="p-4">
            {/* ... (phần render danh sách Sprints) */}
            {regularSprints.map(sprint => (
                <SprintContainer
                    key={sprint._id}
                    sprint={sprint}
                    project={project}
                    onEdit={() => handleOpenEditModal(sprint)}
                    onDelete={() => handleOpenDeleteModal(sprint)}
                />
            ))}

            {/* Phần tạo Sprint */}
            <div className="mt-4">
                {isCreating ? (
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <input
                            type="text"
                            value={newSprintName}
                            onChange={(e) => setNewSprintName(e.target.value)}
                            placeholder="Enter sprint name..."
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                            {/* 2. Cập nhật nút Create */}
                            <button
                                onClick={handleCreateSprint}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center cursor-pointer w-24"
                            >
                                {actionLoading ? <ButtonSpinner text="Creating..." /> : 'Create'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full px-4 py-2 text-sm font-medium text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer"
                    >
                        + Create Sprint
                    </button>
                )}
            </div>

            {/* ... (phần render Backlog) */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Backlog</h3>
                {backlogSprint ? (
                    <SprintContainer sprint={backlogSprint} project={project} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                        <p>Backlog not found.</p>
                    </div>
                )}
            </div>

            {selectedSprint && (
                <>
                    <EditSprintModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseModals}
                        onUpdate={handleUpdateSprint}
                        sprint={selectedSprint}
                        loading={actionLoading}
                    />
                    <DeleteSprintModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseModals}
                        onConfirm={handleDeleteSprint}
                        sprint={selectedSprint}
                        loading={actionLoading}
                    />
                </>
            )}
        </div>
    );
};

export default Backlog;