import { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { getProjectByIdApi } from '../utils/Api/projectApi';
import { getIssuesByProjectApi } from '../utils/Api/issueApi';
import { getStarredProjectsApi, toggleStarProjectApi } from '../utils/Api/accountApi';
import Spinner from '../components/spinner';
import { toast } from 'react-toastify';

import ProjectNavbar from '../components/ProjectNavbar';
import AddMemberModal from '../pages/Project/ProjectDetail/addMemberModal';
import EditBoardColumnsModal from '../pages/Project/ProjectDetail/editboardColumnModal';
import EditIssueTypesModal from '../pages/Project/ProjectDetail/editIssueTypesModal';

const ProjectDetailsLayout = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const fetchIssuesData = async () => {
        try {
            const issuesRes = await getIssuesByProjectApi(projectId);
            if (issuesRes && issuesRes.EC === 0) {
                setIssues(issuesRes.data || []);
            } else { throw new Error(issuesRes.EM || 'Failed to fetch issues.'); }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch issues.');
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            await Promise.all([fetchProjectData(), fetchIssuesData()]);
            try {
                const starredRes = await getStarredProjectsApi();
                if (starredRes && starredRes.EC === 0) {
                    setIsStarred(starredRes.data.some(p => p._id === projectId));
                }
            } catch (err) { console.error("Failed to fetch starred projects:", err); }
            setLoading(false);
        };
        fetchInitialData();
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
        fetchIssuesData();
    };

    const handleTypesUpdate = () => {
        fetchProjectData();
        fetchIssuesData();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <>
            {project && (
                <>
                    <ProjectNavbar
                        projectName={project.name}
                        projectId={project._id}
                        onAddMember={() => setAddMemberModalOpen(true)}
                        onEditBoard={() => setEditBoardModalOpen(true)}
                        onEditIssueTypes={() => setEditIssueTypesModalOpen(true)}
                        isStarred={isStarred}
                        onToggleStar={handleToggleStar}
                        starLoading={starLoading}
                    />
                    <div className="relative h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900">
                        <main className="relative z-10 p-4 lg:p-6">
                            <Outlet context={{ project, setProject, issues, setIssues, fetchProjectData, fetchIssuesData }} />
                        </main>
                    </div>
                </>
            )}

            {isAddMemberModalOpen && (
                <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setAddMemberModalOpen(false)} project={project} />
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