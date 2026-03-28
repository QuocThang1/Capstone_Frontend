import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { HomeOutlined, NotificationOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

const industries = [
  {
    id: "marketing",
    label: "Marketing",
    emoji: <NotificationOutlined />,
    headline: "Campaign Velocity at a Glance",
    description:
      "Track content pipelines, approval cycles, and campaign launches. TASKA surfaces where creative bottlenecks are stalling your go-to-market velocity.",
    metrics: [
      { label: "Campaign Cycle Time", value: "4.2d", delta: "-23%", good: true },
      { label: "Approval Bottlenecks", value: "3", delta: "2 new", good: false },
      { label: "Content Throughput", value: "94%", delta: "+18%", good: true },
    ],
    events: ["Brief created", "Design review", "Copy approved", "Campaign live", "Results analyzed"],
    color: "#EC4899",
    tag: "Campaign pipelines, content approval, launch tracking",
  },
  {
    id: "engineering",
    label: "Engineering",
    emoji: <SettingOutlined />,
    headline: "Ship Faster, Break Less",
    description:
      "Monitor sprint velocity, PR merge cycles, and deployment pipelines. Catch process regressions before they become incidents.",
    metrics: [
      { label: "PR Cycle Time", value: "6.1h", delta: "-40%", good: true },
      { label: "Blocked Issues", value: "7", delta: "+3", good: false },
      { label: "Deployment Freq.", value: "2.4/day", delta: "+60%", good: true },
    ],
    events: ["Issue created", "Dev started", "PR opened", "Review", "Merged", "Deployed"],
    color: "#6366F1",
    tag: "Sprint velocity, PR cycles, deployment pipelines",
  },
  {
    id: "operations",
    label: "Operations",
    emoji: <HomeOutlined />,
    headline: "End-to-End Supply Chain Clarity",
    description:
      "From PO creation to delivery confirmation — monitor every handoff in your operational workflow and resolve delays in real time.",
    metrics: [
      { label: "Order Fulfillment", value: "97.2%", delta: "+5%", good: true },
      { label: "Handoff Delays", value: "2", delta: "-8", good: true },
      { label: "SLA Breaches", value: "0", delta: "Clean", good: true },
    ],
    events: ["PO created", "Procurement", "Production", "QA check", "Shipment", "Delivered"],
    color: "#F59E0B",
    tag: "Supply chain, fulfillment, SLA compliance",
  },
  {
    id: "hr",
    label: "HR",
    emoji: <UserOutlined />,
    headline: "Hire Faster, Onboard Better",
    description:
      "Track recruiting pipelines, onboarding milestones, and employee lifecycle events. Reduce time-to-hire and eliminate onboarding gaps.",
    metrics: [
      { label: "Time to Hire", value: "18d", delta: "-12d", good: true },
      { label: "Onboarding Score", value: "91%", delta: "+14%", good: true },
      { label: "Offer Drop-off", value: "2%", delta: "-8%", good: true },
    ],
    events: ["JD posted", "Screening", "Interview", "Offer", "Onboarding", "Day 90"],
    color: "#10B981",
    tag: "Recruiting pipelines, onboarding, employee lifecycle",
  },
];

export const Industries = () => {
  const [active, setActive] = useState("engineering");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const current = industries.find(i => i.id === active);

  return (
    <section id="industries" className="py-28 bg-white dark:bg-slate-950 transition-all duration-500" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Industry Adaptability
          </div>
          <h2 className="font-display font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            TASKA Speaks<br />
            <span className="gradient-text">Every Team's Language</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto text-slate-600 dark:text-slate-400">
            One platform, every business function. See how TASKA adapts its vocabulary,
            metrics, and insights to your team.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {industries.map(ind => (
            <button
              key={ind.id}
              onClick={() => setActive(ind.id)}
              className={`industry-tab flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${active === ind.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-transparent text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700"}`}
            >
              <span>{ind.emoji}</span>
              {ind.label}
            </button>
          ))}
        </motion.div>

        {/* Dynamic content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Left: context */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold"
                style={{ background: `${current.color}12`, color: current.color }}>
                {current.emoji} {current.label} Teams
              </div>
              <h3 className="font-display font-black text-3xl mb-4 text-slate-900 dark:text-slate-50">
                {current.headline}
              </h3>
              <p className="text-base leading-relaxed mb-8 text-slate-600 dark:text-slate-400">
                {current.description}
              </p>

              {/* Event flow */}
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-3 text-slate-500 dark:text-slate-400">
                  Tracked Workflow
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {current.events.map((ev, i) => (
                    <div key={ev} className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          background: `${current.color}10`,
                          color: current.color,
                          border: `1px solid ${current.color}20`,
                        }}>
                        {ev}
                      </span>
                      {i < current.events.length - 1 && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4l4 4-4 4" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Monitors: {current.tag}
              </p>
            </div>

            {/* Right: metrics dashboard */}
            <div className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none">
              {/* Dashboard header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {current.label} Dashboard
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-md"
                  style={{ background: `${current.color}12`, color: current.color }}>
                  Live
                </span>
              </div>

              <div className="p-6">
                {/* Metrics */}
                <div className="space-y-4">
                  {current.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">{m.label}</div>
                        <div className="font-display font-black text-xl text-slate-900 dark:text-slate-50">{m.value}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${m.good ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                        {m.delta}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Process score */}
                <div className="mt-5 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300" style={{ color: current.color }}>
                      Process Health Score
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-50">87%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div
                      className="h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ background: current.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
  };
