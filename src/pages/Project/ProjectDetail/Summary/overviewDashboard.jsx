import { useOutletContext, useNavigate } from "react-router-dom";
import { DownloadCloud } from "lucide-react";
import ProgressScore from "../../../../components/projectPage/Summary/ProgressScore";
import StatusOverview from "../../../../components/projectPage/Summary/StatusOverview";
import TypesOfWork from "../../../../components/projectPage/Summary/TypesOfWork";
import TeamWorkload from "../../../../components/projectPage/Summary/TeamWorkload";
import SummaryBottlenecks from "../../../../components/projectPage/Summary/SummaryBottlenecks";
import SummaryEvents from "../../../../components/projectPage/Summary/SummaryEvents";
import MyWorkSection from "../../../../components/projectPage/Summary/MyWorkSection";

const OverviewDashboard = () => {
  const { project, issues, socket } = useOutletContext();
  const navigate = useNavigate();

  if (!project || !issues) return null;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Summary</h1>
          <p className="mt-1 text-slate-500">Real-time intelligence on workflow health, distribution and bottlenecks.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md">
          <DownloadCloud className="w-4 h-4" /> Generate Report
        </button>
      </div>

      {/* MASTER GRID - BENTO BOX STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        <div className="col-span-1">
          <ProgressScore issues={issues} />
        </div>
        <div className="col-span-1">
          <StatusOverview issues={issues} />
        </div>
        <div className="col-span-1 row-span-2 h-full">
          <SummaryEvents project={project} socket={socket} navigate={navigate} />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <SummaryBottlenecks project={project} socket={socket} navigate={navigate} />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <TeamWorkload project={project} issues={issues} navigate={navigate} />
        </div>
        <div className="col-span-1">
          <TypesOfWork issues={issues} />
        </div>
      </div>
      <MyWorkSection project={project} issues={issues} />
    </div>
  );
}

export default OverviewDashboard;