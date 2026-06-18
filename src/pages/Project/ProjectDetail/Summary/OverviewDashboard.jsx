import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { DownloadCloud, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getIssuesByProjectApi } from "../../../../utils/Api/issueApi";
import { exportProjectExcelApi, exportProjectPdfApi } from "../../../../utils/Api/exportApi";
import { toast } from "react-toastify";
import Spinner from "../../../../components/spinner";
import ProgressScore from "../../../../components/projectPage/Summary/ProgressScore";
import StatusOverview from "../../../../components/projectPage/Summary/StatusOverview";
import TypesOfWork from "../../../../components/projectPage/Summary/TypesOfWork";
import TeamWorkload from "../../../../components/projectPage/Summary/TeamWorkload";
import SummaryBottlenecks from "../../../../components/projectPage/Summary/SummaryBottlenecks";
import SummaryEvents from "../../../../components/projectPage/Summary/SummaryEvents";
import MyWorkSection from "../../../../components/projectPage/Summary/MyWorkSection";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const OverviewDashboard = () => {
  const { project, socket } = useOutletContext();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!project?._id) return;
      setLoading(true);
      try {
        const res = await getIssuesByProjectApi(project._id);
        if (res?.EC === 0) {
          setIssues(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching issues in Overview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [project]);

  const handleExportExcel = async () => {
    if (!project?._id) return;
    setExportingExcel(true);
    try {
      const response = await exportProjectExcelApi(project._id);

      // Handle case where backend returns JSON error disguised as a Blob
      if (response instanceof Blob && response.type === 'application/json') {
        const text = await response.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.EM || "Export failed");
      }

      const blob = response instanceof Blob ? response : new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Project_${project.key || "Data"}_Export.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Excel exported successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to export Excel data.");
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    if (!project?._id) return;
    setExportingPdf(true);
    try {
      const response = await exportProjectPdfApi(project._id);

      if (response instanceof Blob && response.type === 'application/json') {
        const text = await response.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.EM || "Export failed");
      }

      const blob = response instanceof Blob ? response : new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Project_${project.key || "Data"}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("PDF report exported successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to export PDF report.");
    } finally {
      setExportingPdf(false);
    }
  };

  if (!project) return null;
  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><Spinner /></div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Summary</h1>
          <p className="mt-1 text-slate-500">Real-time intelligence on workflow health, distribution and bottlenecks.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className=" cursor-pointer inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {exportingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Export Excel
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
          >
            {exportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Export PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

        <motion.div variants={itemVariants} className="col-span-1">
          <ProgressScore issues={issues} />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1">
          <StatusOverview issues={issues} />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 row-span-2 h-full">
          <SummaryEvents project={project} socket={socket} navigate={navigate} />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
          <SummaryBottlenecks project={project} socket={socket} navigate={navigate} />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
          <TeamWorkload project={project} issues={issues} navigate={navigate} />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1">
          <TypesOfWork issues={issues} />
        </motion.div>

      </div>

      <motion.div variants={itemVariants}>
        <MyWorkSection project={project} issues={issues} />
      </motion.div>

    </motion.div>
  );
}

export default OverviewDashboard;
