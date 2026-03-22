import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileSearchOutlined,
  HeartOutlined,
  BellOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const cards = [
  {
    icon: <FileSearchOutlined />,
    tag: "Universal Event Logging",
    title: "Record Any Action from Any Tool",
    description:
      "Captures every TaskStart, handoff, and Completion instantly — regardless of the tool or platform. From Slack to Salesforce, every event is unified in one timeline.",
    wide: true,
    accent: "#6366F1",
    bg: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)",
    border: "#C7D2FE",
    highlight: "TaskStart → Completion tracking",
    visual: (
      <div className="flex flex-col gap-2 mt-4">
        {[
          { tool: "GitHub", event: "PR merged", time: "2s ago", dot: "#6366F1" },
          { tool: "Slack", event: "Task assigned", time: "14s ago", dot: "#8B5CF6" },
          { tool: "Jira", event: "Sprint updated", time: "1m ago", dot: "#EC4899" },
          { tool: "Notion", event: "Doc created", time: "3m ago", dot: "#10B981" },
        ].map(e => (
          <div key={e.tool} className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.dot }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>{e.tool}</span>
            <span className="text-xs flex-1" style={{ color: "var(--text-secondary)" }}>{e.event}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{e.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <HeartOutlined />,
    tag: "Process Health Score",
    title: "Continuous or Interrupted?",
    description:
      "A single metric that tells you if your team is flowing or stuck. The Process Health Score distills thousands of events into one actionable number.",
    wide: false,
    accent: "#8B5CF6",
    bg: "#FFFFFF",
    border: "#E2E8F0",
    highlight: "Single-metric clarity",
    visual: (
      <div className="mt-4 flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg width="112" height="112" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle
              cx="56" cy="56" r="48"
              fill="none"
              stroke="#6366F1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48 * 0.87} ${2 * Math.PI * 48}`}
              transform="rotate(-90 56 56)"
            />
          </svg>
          <div className="absolute text-center">
            <div className="font-display font-black text-2xl" style={{ color: "var(--badge-text)" }}>87%</div>
            <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Healthy</div>
          </div>
        </div>
        <div className="flex gap-3 mt-3 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--badge-text)" }} /> Continuous
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--surface-border)" }} /> Interrupted
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: <BellOutlined />,
    tag: "Smart Alerts",
    title: "Process Delays & Collaboration Gaps",
    description:
      "Not just bug alerts — TASKA detects when a task sits idle too long or when team handoffs create invisible delays. Rose-colored alerts mean something needs your attention.",
    wide: false,
    accent: "#EC4899",
    bg: "#FFFFFF",
    border: "#E2E8F0",
    highlight: "Zero false positives",
    visual: (
      <div className="flex flex-col gap-2 mt-4">
        {[
          { type: "Process Delay", detail: "API review blocked 4h", severity: "high" },
          { type: "Collaboration Gap", detail: "No response for 6h", severity: "med" },
        ].map(a => (
          <div key={a.type} className="flex items-start gap-3 rounded-xl px-3 py-2.5"
            style={{
              background: a.severity === "high" ? "rgba(236,72,153,0.06)" : "rgba(251,146,60,0.06)",
              border: `1px solid ${a.severity === "high" ? "rgba(236,72,153,0.2)" : "rgba(251,146,60,0.2)"}`,
            }}>
            <span className="text-base mt-0.5">{a.severity === "high" ? "🔴" : "🟡"}</span>
            <div>
              <div className="text-xs font-bold"
                style={{ color: a.severity === "high" ? "#EC4899" : "#F59E0B" }}>
                {a.type}
              </div>
              <div className="text-xs" style={{ color: "#64748B" }}>{a.detail}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <BarChartOutlined />,
    tag: "Visual Aggregation",
    title: "Raw Logs → Gantt & Flow Charts",
    description:
      "Turn thousands of raw event logs into beautiful, actionable visualizations. Gantt charts, flow diagrams, and bottleneck heatmaps — all auto-generated, always current.",
    wide: true,
    accent: "#10B981",
    bg: "linear-gradient(135deg, #ECFDF5 0%, #F8FAFC 100%)",
    border: "#A7F3D0",
    highlight: "Gantt + Flow charts",
    visual: (
      <div className="mt-4">
        {["Design", "Development", "Testing", "Deploy"].map((task, i) => (
          <div key={task} className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium w-20 text-right" style={{ color: "var(--text-secondary)" }}>{task}</span>
            <div className="flex-1 h-5 rounded-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
              <div
                className="absolute h-5 rounded-full"
                style={{
                  left: `${i * 10}%`,
                  width: `${[60, 80, 50, 30][i]}%`,
                  background: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981"][i],
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-28 bg-white dark:bg-slate-950 transition-all duration-500" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Analysis Modules
          </div>
          <h2 className="font-display font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Everything You Need to<br />
            <span className="gradient-text">Understand Your Processes</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto text-slate-600 dark:text-slate-400">
            Four precision-engineered modules that go from raw event data to
            intelligent, actionable insights automatically.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`bento-card rounded-3xl p-8 flex flex-col ${card.wide ? "md:col-span-2" : ""} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700`}
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${card.accent}15`, color: card.accent }}>
                  {card.icon}
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: card.accent }}>
                    {card.tag}
                  </span>
                  <h3 className="font-display font-bold text-lg leading-snug mt-0.5 text-slate-900 dark:text-slate-50">
                    {card.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {card.description}
              </p>

              {card.visual}

              <div className="mt-5 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: `${card.accent}12`, color: card.accent }}>
                  {card.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
