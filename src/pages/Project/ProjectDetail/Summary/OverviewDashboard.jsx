import { useOutletContext, useNavigate } from "react-router-dom";
import { DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";
import ProgressScore from "../../../../components/projectPage/Summary/ProgressScore";
import StatusOverview from "../../../../components/projectPage/Summary/StatusOverview";
import TypesOfWork from "../../../../components/projectPage/Summary/TypesOfWork";
import TeamWorkload from "../../../../components/projectPage/Summary/TeamWorkLoad";
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
  const { project, issues, socket } = useOutletContext();
  const navigate = useNavigate();

  if (!project || !issues) return null;

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
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md">
          <DownloadCloud className="w-4 h-4" /> Generate Report
        </button>
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
