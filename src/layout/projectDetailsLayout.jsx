import { useState, useEffect, useContext } from 'react';
import { useParams, Outlet, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { getProjectByIdApi } from '../utils/Api/projectApi';
import { getStarredProjectsApi, toggleStarProjectApi } from '../utils/Api/accountApi';
import Spinner from '../components/spinner';
import { toast } from 'react-toastify';
import socket from '../utils/socket';

import ProjectNavbar from '../components/ProjectNavbar';
import AddMemberModal from '../pages/Project/ProjectDetail/addMemberModal';
import EditBoardColumnsModal from '../pages/Project/ProjectDetail/editboardColumnModal';
import EditIssueTypesModal from '../pages/Project/ProjectDetail/editIssueTypesModal';
import FloatingReviewBanner from '../components/projectPage/FloatingReviewBanner';

const ProjectDetailsLayout = () => {
    const { projectId } = useParams();
    const { auth } = useContext(AuthContext);
    const currentUserId = auth?.user?.id;

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const intendedUser = searchParams.get('intendedUser');

    const [isStarred, setIsStarred] = useState(false);
    const [starLoading, setStarLoading] = useState(false);

    const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [isEditBoardModalOpen, setEditBoardModalOpen] = useState(false);
    const [isEditIssueTypesModalOpen, setEditIssueTypesModalOpen] = useState(false);

    const fetchProjectData = async () => {
        try {
            const projectRes = await getProjectByIdApi(projectId);
            if (projectRes && projectRes.EC === 0) {
                setProject(projectRes.data);
            } else { throw new Error(projectRes.EM || 'Project not found.'); }
        } catch (err) {
            setError(err.message || 'Failed to fetch project data.');
            toast.error(err.message || 'Failed to fetch project data.');
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            await fetchProjectData();
            try {
                const starredRes = await getStarredProjectsApi();
                if (starredRes && starredRes.EC === 0) {
                    setIsStarred(starredRes.data.some(p => p._id === projectId));
                }
            } catch (err) { console.error("Failed to fetch starred projects:", err); }
            setLoading(false);
        };
        fetchInitialData();

        if (socket) {
            socket.emit('join_project_room', projectId);
        }

        return () => {
            if (socket) {
                socket.emit('leave_project_room', projectId);
            }
        };
    }, [projectId]);

    const handleToggleStar = async (e) => {
        e.stopPropagation();
        setStarLoading(true);
        try {
            const res = await toggleStarProjectApi(projectId);
            if (res && res.EC === 0) {
                setIsStarred(res.data.includes(projectId));
                toast.success(res.EM);
            } else { toast.error(res.EM || "Failed to update star status."); }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setStarLoading(false);
        }
    };

    const handleColumnsUpdate = () => {
        fetchProjectData();
    };

    const handleTypesUpdate = () => {
        fetchProjectData();
    };

    const handleMemberUpdate = () => {
        fetchProjectData();
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    if (intendedUser && auth?.user?._id && intendedUser !== auth.user._id) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-center p-4">
                <div className="max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                        This link was intended for another user, but you are currently logged in as <strong>{auth.user.email}</strong>.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Please log out and log back in with the correct account to view this task.
                    </p>
                </div>
            </div>
        );
    }

    const isLeader = project?.members?.some(m => {
        const account = m.accountId || {};

        if (account.email && auth?.user?.email && account.email === auth.user.email) {
            return m.role === 'leader';
        }

        const memberId = String(account._id || account);
        const currId = String(currentUserId || "");
        return memberId === currId && m.role === 'leader';
    }) || false;

    return (
        <>
            {project && (
                <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <ProjectNavbar
                        projectName={project.name}
                        projectId={project._id}
                        projectTimezone={project.timezone}
                        fetchProjectData={fetchProjectData}
                        onAddMember={() => setAddMemberModalOpen(true)}
                        onEditBoard={() => setEditBoardModalOpen(true)}
                        onEditIssueTypes={() => setEditIssueTypesModalOpen(true)}
                        isStarred={isStarred}
                        onToggleStar={handleToggleStar}
                        starLoading={starLoading}
                        isLeader={isLeader}
                    />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-4 pb-10 lg:pb-12 relative">
                        <Outlet context={{ project, setProject, fetchProjectData, socket, isLeader }} />
                    </main>
                    <FloatingReviewBanner project={project} fetchProjectData={fetchProjectData} />
                </div>
            )}

            {isAddMemberModalOpen && (
                <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setAddMemberModalOpen(false)} project={project} onMemberUpdate={handleMemberUpdate} />
            )}
            {isEditBoardModalOpen && (
                <EditBoardColumnsModal isOpen={isEditBoardModalOpen} onClose={() => setEditBoardModalOpen(false)} project={project} onColumnsUpdate={handleColumnsUpdate} />
            )}
            {isEditIssueTypesModalOpen && (
                <EditIssueTypesModal isOpen={isEditIssueTypesModalOpen} onClose={() => setEditIssueTypesModalOpen(false)} project={project} onTypesUpdate={handleTypesUpdate} />
            )}
        </>
    );
};

export default ProjectDetailsLayout;