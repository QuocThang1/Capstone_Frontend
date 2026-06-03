import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircleOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";

const nodes = [
  { id: "start",   label: "Process Start",  x: -30,  y: 50, color: "#FFFFFF" },
  { id: "design",  label: "Design Phase",   x: 8, y: 22, color: "#FFFFFF" },
  { id: "dev",     label: "Development",    x: 8, y: 78, color: "#FFFFFF" },
  { id: "review",  label: "Review Gate",    x: 40, y: 50, color: "#FFFFFF" },
  { id: "blocked", label: "Bottleneck",     x: 80, y: 50, color: "#FFFFFF" },
  { id: "deploy",  label: "Deploy",         x: 105, y: 28, color: "#FFFFFF" },
  { id: "done",    label: "Resolved",       x: 130, y: 50, color: "#FFFFFF" },
];

const edges = [
  { from: "start",   to: "design"  },
  { from: "start",   to: "dev"     },
  { from: "design",  to: "review"  },
  { from: "dev",     to: "review"  },
  { from: "review",  to: "blocked" },
  { from: "blocked", to: "deploy"  },
  { from: "deploy",  to: "done"    },
];

const steps = [
  {
    id: "analyze",
    iconComponent: ExclamationCircleOutlined,
    title: "Analyze",
    color: "#8B5CF6",
    subtitle: "Root Cause Mapping",
    description:
      "Once a bottleneck is flagged, TASKA traces the full upstream dependency chain — mapping every handoff, resource contention, and collaboration gap that contributed to the delay.",
    bullets: [
      "Full upstream path traced from start to blocked node",
      "Handoff gap scoring across team boundaries",
      "Resource contention detection per assignee",
      "Dependency graph rendered for visual root-cause review",
    ],
    highlightNodes: ["start", "design", "dev", "review", "blocked"],
    highlightEdges: [
      { from: "start",  to: "design"  },
      { from: "start",  to: "dev"     },
      { from: "design", to: "review"  },
      { from: "dev",    to: "review"  },
      { from: "review", to: "blocked" },
    ],
    annotation: { nodeId: "review", text: "Handoff gap: 3.2h" },
  },
  {
    id: "detect",
    iconComponent: SearchOutlined,
    color: "#EC4899",
    title: "Detect",
    subtitle: "Anomaly Identification",
    description:
      "TASKA's ML engine continuously compares live task durations against historical baselines. When any node exceeds 2× its expected cycle time, an anomaly event is fired.",
    bullets: [
      "WebSocket streams feed event data in real-time",
      "Aggregation pipeline computes running averages per node",
      "Statistical z-score thresholding triggers detection",
      "Zero manual queries — fully automated",
    ],
    highlightNodes: ["review", "blocked"],
    highlightEdges: [{ from: "review", to: "blocked" }],
    annotation: { nodeId: "blocked", text: "2.4× over baseline" },
  },
  {
    id: "resolve",
    iconComponent: CheckCircleOutlined,
    title: "Resolve",
    color: "#10B981",
    subtitle: "Automated Playbooks",
    description:
      "TASKA suggests targeted resolution playbooks: one-click reassignment, priority escalation, or dependency unblocking. The resolved path is tracked and the Process Health Score updates live.",
    bullets: [
      "Suggested playbook generated based on root cause type",
      "One-click reassignment to available team member",
      "Priority escalation notifies stakeholders via Slack/email",
      "Process Health Score recalculated after each action",
    ],
    highlightNodes: ["blocked", "deploy", "done"],
    highlightEdges: [
      { from: "blocked", to: "deploy" },
      { from: "deploy",  to: "done"   },
    ],
    annotation: { nodeId: "done", text: "Score +6.2 pts" },
  },
];

const edgeKey = (e) => `${e.from}-${e.to}`;

// Helper function to render icons with dynamic color
const renderIcon = (IconComponent, isActive, color) => (
  <IconComponent style={{ color: isActive ? color : "white" }} />
);

const InteractiveDiagram = ({ activeStep }) => {
  const step = steps.find(s => s.id === activeStep);
  const highlightedNodes = new Set(step?.highlightNodes ?? []);
  const highlightedEdges = new Set((step?.highlightEdges ?? []).map(edgeKey));

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const annotationNode = step?.annotation ? nodeMap[step.annotation.nodeId] : null;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      {/* ── Edges ── */}
      {edges.map(edge => {
        const n1 = nodeMap[edge.from];
        const n2 = nodeMap[edge.to];
        const key = edgeKey(edge);
        const isHighlighted = highlightedEdges.has(key);
        const isBottleneck = edge.to === "blocked";

        return (
          <g key={key}>
            {isHighlighted && (
              <line
                x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke={step.color}
                strokeWidth="1.5"
                opacity="0.3"
              />
            )}
            <line
              x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={isHighlighted ? step.color : "#FFFFFF"}
              strokeWidth={isHighlighted ? "0.8" : "0.5"}
              strokeOpacity={isHighlighted ? 1 : 0.35}
              strokeDasharray={isBottleneck && !isHighlighted ? "1.5,1.5" : undefined}
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Arrow head */}
            {(() => {
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / len;
              const uy = dy / len;
              const tipX = n2.x - ux * 3.5;
              const tipY = n2.y - uy * 3.5;
              const px = -uy * 1.8;
              const py = ux * 1.8;
              return (
                <polygon
                  points={`${tipX},${tipY} ${tipX - ux * 4.2 + px},${tipY - uy * 4.2 + py} ${tipX - ux * 4.2 - px},${tipY - uy * 4.2 - py}`}
                  fill={isHighlighted ? step.color : "#FFFFFF"}
                  fillOpacity={isHighlighted ? 1 : 0.35}
                  style={{ transition: "fill 0.4s ease" }}
                />
              );
            })()}
          </g>
        );
      })}

      {/* ── Nodes ── */}
      {nodes.map(node => {
        const isHighlighted = highlightedNodes.has(node.id);
        const isBlocked = node.id === "blocked";

        return (
          <g key={node.id}>
            {/* Outer glow ring */}
            {isHighlighted && (
              <motion.circle
                cx={node.x} cy={node.y}
                r={isBlocked ? 9 : 7}
                fill="none"
                stroke={step.color}
                strokeWidth="0.6"
                opacity="0.35"
                initial={{ r: isBlocked ? 9 : 7 }}
                animate={{ r: [isBlocked ? 9 : 7, isBlocked ? 13 : 11, isBlocked ? 9 : 7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Blocked special halo */}
            {isBlocked && !isHighlighted && (
              <circle
                cx={node.x} cy={node.y} r="7"
                fill="rgba(236,72,153,0.08)"
                stroke="rgba(236,72,153,0.2)"
                strokeWidth="0.5"
              />
            )}

            {/* Main circle */}
            <motion.circle
              cx={node.x} cy={node.y}
              r={isHighlighted ? 4.5 : 3.5}
              fill={isHighlighted ? step.color : node.color}
              stroke={isHighlighted ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
              strokeWidth="0.6"
              opacity={isHighlighted ? 1 : 0.45}
              style={{ transition: "all 0.4s ease" }}
            />

            {/* Label above */}
            <text
              x={node.x} y={node.y - 6.5}
              textAnchor="middle"
              fontSize="3.2"
              fontWeight={isHighlighted ? "700" : "400"}
              fill={isHighlighted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)"}
              fontFamily="Inter, sans-serif"
              style={{ transition: "all 0.4s ease" }}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* ── Floating annotation ── */}
      <AnimatePresence mode="wait">
        {annotationNode && step?.annotation && (
          <motion.g
            key={`annotation-${activeStep}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <rect
              x={annotationNode.x - 15}
              y={annotationNode.y + 7}
              width="30"
              height="6"
              rx="1.5"
              fill={step.color}
              opacity="0.9"
            />
            <text
              x={annotationNode.x}
              y={annotationNode.y + 11.5}
              textAnchor="middle"
              fontSize="2.8"
              fontWeight="700"
              fill="#FFFFFF"
              fontFamily="Inter, sans-serif"
            >
              {step.annotation.text}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
};

export const Platform = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState("detect");

  const currentStep = steps.find(s => s.id === activeStep);

  return (
    <section
      id="platform"
      className="py-28 dark-section relative overflow-hidden"
      ref={ref}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
          >
            The Bottleneck Engine
          </div>
          <h2
            className="font-display font-black tracking-tight mb-4 text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Detect. Analyze. Resolve.
            <br />
            <span className="gradient-text">Automated by Our Pipeline.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto text-white/75 dark:text-slate-300/80">
            Click each step below to see exactly how TASKA processes your workflow data
            — and which nodes it operates on.
          </p>
        </motion.div>

        {/* Main interactive panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="rounded-3xl overflow-hidden mb-8 bg-white/5 border border-indigo-200/30 dark:bg-slate-900/80 dark:border-slate-700 shadow-2xl"
        >
          {/* Window bar */}
          <div
            className="px-6 py-4 flex items-center justify-between border-b border-white/10"
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/20 dark:bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/20 dark:bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/20 dark:bg-white/10" />
            </div>
            <span className="text-xs font-semibold text-white/70 dark:text-slate-200/70">
              TASKA — Aggregation Pipeline View
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: currentStep.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: currentStep.color }}
                />
                {renderIcon(currentStep.iconComponent, true, currentStep.color)} {currentStep.title} Mode
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Diagram + panel grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* SVG diagram — 3 cols */}
            <div
              className="lg:col-span-3 p-6 flex items-center justify-center"
              style={{
                aspectRatio: "16 / 9",
                minHeight: 300,
                borderRight: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ width: "100%", height: "100%" }}>
                <InteractiveDiagram activeStep={activeStep} />
              </div>
            </div>

            {/* Detail panel — 2 cols */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-2 p-7 flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${currentStep.color}20` }}
                  >
                    {renderIcon(currentStep.iconComponent, true, currentStep.color)}
                  </div>
                  <div>
                    <h4
                      className="font-display font-black text-lg leading-tight"
                      style={{ color: currentStep.color }}
                    >
                      {currentStep.title}
                    </h4>
                    <p className="text-xs font-semibold text-white/70 dark:text-slate-200/70">
                      {currentStep.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-5 text-white/75 dark:text-slate-300">
                  {currentStep.description}
                </p>

                <ul className="space-y-2.5">
                  {currentStep.bullets.map((b, i) => (
                    <motion.li
                      key={b}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-2.5 text-xs text-white/70 dark:text-slate-300/80"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: currentStep.color }}
                      />
                      {b}
                    </motion.li>
                  ))}
                </ul>

                {/* Highlighted nodes legend */}
                <div
                  className="mt-5 pt-4 flex flex-wrap gap-2 border-t border-white/10"
                >
                  <span className="text-xs font-semibold w-full mb-1 text-white/40 dark:text-slate-300/40">
                    Nodes highlighted on diagram:
                  </span>
                  {currentStep.highlightNodes.map(nodeId => {
                    const node = nodes.find(n => n.id === nodeId);
                    return (
                      <span
                        key={nodeId}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{
                          background: `${currentStep.color}18`,
                          color: currentStep.color,
                          border: `1px solid ${currentStep.color}30`,
                        }}
                      >
                        {node?.label}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3-col bottom: one card per step, clickable */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10"
          >
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="text-left px-7 py-6 transition-all"
                style={{
                  background: activeStep === step.id ? `${step.color}10` : "rgba(15,23,42,0.38)",
                  borderRight: i < 2 ? "1px solid rgba(148,163,184,0.2)" : undefined,
                  borderTop: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  if (activeStep !== step.id) e.currentTarget.style.background = "rgba(15,23,42,0.48)";
                }}
                onMouseLeave={e => {
                  if (activeStep !== step.id) e.currentTarget.style.background = "rgba(15,23,42,0.38)";
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{renderIcon(step.iconComponent, activeStep === step.id, step.color)}</span>
                  <h4
                    className="font-display font-bold text-base"
                    style={{ color: activeStep === step.id ? step.color : "rgba(226,232,240,0.9)" }}
                  >
                    {step.title}
                  </h4>
                  {activeStep === step.id && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${step.color}25`, color: step.color }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.65)" }}>
                  {step.subtitle}
                </p>
                {/* Mini node pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {step.highlightNodes.map(nid => {
                    const n = nodes.find(x => x.id === nid);
                    return (
                      <span
                        key={nid}
                        className="text-xs px-2 py-0.5 rounded-md font-medium"
                        style={{
                          background: activeStep === step.id ? `${step.color}18` : "rgba(255,255,255,0.06)",
                          color: activeStep === step.id ? step.color : "rgba(255,255,255,0.3)",
                          border: `1px solid ${activeStep === step.id ? `${step.color}30` : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        {n?.label}
                      </span>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {[
            { v: "< 90s", l: "Avg. detection time" },
            { v: "99.4%", l: "Root cause accuracy" },
            { v: "0",     l: "Manual queries required" },
            { v: "500+",  l: "Process types monitored" },
          ].map(s => (
            <div
              key={s.l}
              className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(15,23,42,0.36)", border: "1px solid rgba(148,163,184,0.2)" }}
            >
              <div className="font-display font-black text-2xl mb-1 gradient-text">{s.v}</div>
              <div className="text-xs" style={{ color: "rgba(226,232,240,0.7)" }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
