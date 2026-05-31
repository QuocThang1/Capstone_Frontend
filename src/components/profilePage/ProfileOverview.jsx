import { useState, useMemo, useEffect } from "react";
import { Calendar, Star, GitBranch, CheckCircle2, Clock, ShieldCheck, Folder, Info } from "lucide-react";
import { getAllProjectsApi } from "../../utils/Api/projectApi";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back to the Sunday of the week 52 weeks ago
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay()); // rewind to Sunday

  const weeks = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor);
      const isFuture = date > today;
      week.push({
        date,
        label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
        level: isFuture ? -1 : Math.random() > 0.65
          ? Math.random() > 0.5 ? 3 : 2
          : Math.random() > 0.4 ? 1 : 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function CalendarHeatmap() {
  const [tooltip, setTooltip] = useState(null);
  const weeks = useMemo(() => buildCalendar(), []);

  // month labels: find first week of each month
  const monthLabels = useMemo(() => {
    const labels = [];
    weeks.forEach((week, wi) => {
      const month = week[0].date.toLocaleDateString("en-US", { month: "short" });
      labels.push({ wi, month });
    });
    // dedupe consecutive same months
    return labels.filter((l, i) => i === 0 || labels[i - 1].month !== l.month);
  }, [weeks]);

  const cellColors = [
    "bg-slate-100 dark:bg-slate-700",           // level 0
    "bg-[#6366F1]/30 dark:bg-[#6366F1]/25",     // level 1
    "bg-[#6366F1]/55 dark:bg-[#6366F1]/50",     // level 2
    "bg-[#6366F1] dark:bg-[#6366F1]",           // level 3
  ];

  return (
    <div className="relative">
      {/* month labels row */}
      <div className="flex mb-1 ml-8">
        {weeks.map((_, wi) => {
          const label = monthLabels.find((m) => m.wi === wi);
          return (
            <div key={wi} className="flex-1 text-left">
              {label && (
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                  {label.month}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-0.5">
        {/* day label column */}
        <div className="flex flex-col gap-0.5 mr-1 flex-shrink-0">
          {DAY_LABELS.map((d, i) => (
            <div key={d} className="h-3.5 flex items-center">
              {i % 2 === 1 && (
                <span className="text-[9px] text-slate-400 dark:text-slate-500 w-7 text-right pr-1">
                  {d}
                </span>
              )}
              {i % 2 !== 1 && <span className="w-7" />}
            </div>
          ))}
        </div>

        {/* heatmap grid */}
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`rrelative w-3 h-3 rounded-[3px] cursor-pointer transition-opacity hover:opacity-80 ${
                    cell.level < 0
                      ? "opacity-0 pointer-events-none"
                      : cellColors[cell.level]
                  }`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ x: rect.left, y: rect.top, label: cell.label });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[10px] text-slate-400">Less</span>
        {cellColors.map((c, i) => (
          <span key={i} className={`inline-block w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>

      {/* tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded-md text-[11px] font-medium
            bg-slate-900 dark:bg-slate-700 text-white shadow-lg whitespace-nowrap"
          style={{ top: tooltip.y - 30, left: tooltip.x + 8 }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}

function CompletionBar({ pct }) {
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
      <div className="h-2 rounded-full bg-[#6366F1] transition-all duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

function completionPct(profile) {
  const fields = ["fullName", "username", "email", "phone", "dob", "gender", "bio", "avatar"];
  const filled = fields.filter((f) => profile?.[f]?.trim?.() || profile?.[f]);
  return Math.round((filled.length / fields.length) * 100);
}

function ProjectCard({ project }) {
  // Support both API response structure and old mock structure
  const name = project.name || project.title || "Untitled";
  const description = project.description || "";
  const visibility = project.visibility || "Private";
  const color = project.color || "#6366F1";
  
  return (
    <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
          <span className="text-sm font-semibold text-[#6366F1] dark:text-indigo-400 truncate">
            {name}
          </span>
        </div>
        <span className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">
          {visibility}
        </span>
      </div>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
      <div className="flex items-center gap-1.5 mt-auto">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{project.lang || "Project"}</span>
      </div>
    </div>
  );
}

export default function ProfileOverview({ profile }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const pct = completionPct(profile);
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const res = await getAllProjectsApi({ limit: 6 });
        if (res?.EC === 0 && res?.DT) {
          setProjects(res.DT);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-[#6366F1]/10 dark:bg-[#6366F1]/15 border border-[#6366F1]/30 dark:border-[#6366F1]/40 rounded-xl px-4 py-3.5">
        <Info className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#6366F1] dark:text-indigo-300 leading-relaxed">
          Keep your profile up to date. A complete profile helps teammates identify and contact you faster.
        </p>
      </div>

      {/* Projects header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#6366F1]" />
          Popular Projects
        </h2>
        <button className="text-xs text-[#6366F1] hover:underline font-medium">
          Customize your pins
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {loadingProjects ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-xl h-32 animate-pulse" />
          ))
        ) : projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard key={p._id || p.name} project={p} />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No projects found</p>
          </div>
        )}
      </div>

      {/* Activity section */}
      <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[#6366F1]" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account Activity</h3>
        </div>

        {/* Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">Profile completion</span>
            <span className="text-xs font-semibold text-[#6366F1]">{pct}%</span>
          </div>
          <CompletionBar pct={pct} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: "Verified", value: "Email" },
            { icon: Clock, label: "Updated", value: lastUpdated },
            { icon: ShieldCheck, label: "Role", value: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
              <Icon className="w-4 h-4 text-[#6366F1]" />
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 text-center">{value}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Profile activity — last 52 weeks
          </p>
          <div className="overflow-x-auto pb-1">
            <CalendarHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
}
