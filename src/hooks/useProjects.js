import { useState, useEffect } from "react";
import { getMyProjectsApi } from "../utils/Api/projectApi";
import { toast } from "react-toastify";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects from MongoDB backend
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProjectsApi();
      if (res && res.EC === 0) {
        setProjects(res.DT || []);
      } else {
        const errorMsg = res?.EM || "Failed to fetch projects";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An error occurred while fetching your projects.";
      console.error("Failed to fetch projects:", err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    setProjects,
    isCreateModalOpen,
    setCreateModalOpen,
    loading,
    error,
    refetch: fetchProjects,
  };
};

export default useProjects;
