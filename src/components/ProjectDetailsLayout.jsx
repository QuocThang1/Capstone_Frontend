import React, { useContext, useEffect, useState } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import ProjectNavbar from './ProjectNavbar';
import { ProjectContext } from '../context/project.context';

/**
 * ProjectDetailsLayout
 * 
 * Wrapper component that displays the ProjectNavbar and main content
 * for a specific project view. Auto-detects project from URL params.
 */
const ProjectDetailsLayout = () => {
  const { projectId } = useParams();
  const { allProjects } = useContext(ProjectContext);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find the project from context
  useEffect(() => {
    if (allProjects && projectId) {
      const foundProject = allProjects.find(p => p._id === projectId);
      setProject(foundProject);
      setIsLoading(false);
    }
  }, [projectId, allProjects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // If project not found, redirect to projects
  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Project Navigation Bar */}
      <ProjectNavbar projectName={project.name} projectId={projectId} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-auto p-6">
        <Outlet context={{ project }} />
      </main>
    </div>
  );
};

export default ProjectDetailsLayout;
