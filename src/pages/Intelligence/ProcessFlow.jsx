import { useState, useRef, useCallback } from "react";
import {
  GitBranch, Plus, ZoomIn, ZoomOut, Maximize2,
  CheckCircle2, Clock, AlertCircle, Circle, X,
  User, Calendar, Tag, ChevronDown
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────
const NODE_W = 160;
const NODE_H = 72;
const CANVAS_W = 1400;
const CANVAS_H = 520;

// ─── Workflow Templates ────────────────────────────────────
const WORKFLOWS = {
  "Supply Chain": {
    nodes: [
      { id: "recv",     label: "Order Received",      x: 60,   y: 220, status: "completed", type: "trigger",  assignee: "System",       duration: "< 1s",   desc: "Customer order captured from e-commerce API and queued for processing." },
      { id: "inv",      label: "Inventory Check",      x: 270,  y: 140, status: "completed", type: "process",  assignee: "InventoryBot", duration: "1.2s",   desc: "Validates that all SKUs in the order have sufficient stock levels." },
      { id: "pay",      label: "Payment Auth",         x: 270,  y: 310, status: "completed", type: "process",  assignee: "PaymentGW",    duration: "800ms",  desc: "Authorises payment via Stripe. Captures on successful fulfilment." },
      { id: "proc",     label: "Process Order",        x: 490,  y: 220, status: "active",    type: "process",  assignee: "Sarah Chen",   duration: "~4 min", desc: "Warehouse picks and packs items. Barcode scan confirms each SKU." },
      { id: "ship",     label: "Shipping Label",       x: 710,  y: 140, status: "pending",   type: "process",  assignee: "LogisticsBot", duration: "—",      desc: "Generates carrier label (DHL/FedEx) and notifies the customer." },
      { id: "track",    label: "Track & Notify",       x: 710,  y: 310, status: "pending",   type: "process",  assignee: "NotifyBot",    duration: "—",      desc: "Sends real-time tracking link via email and SMS to the customer." },
      { id: "deliver",  label: "Delivered",            x: 930,  y: 220, status: "pending",   type: "end",      assignee: "—",            duration: "—",      desc: "Order confirmed delivered. Triggers post-purchase review request." },
      { id: "err",      label: "Error Handler",        x: 490,  y: 390, status: "idle",      type: "error",    assignee: "Jake Thompson", duration: "—",     desc: "Catches failed inventory or payment steps and alerts the ops team." },
    ],
    edges: [
      { from: "recv",  to: "inv",     label: "" },
      { from: "recv",  to: "pay",     label: "" },
      { from: "inv",   to: "proc",    label: "in stock" },
      { from: "pay",   to: "proc",    label: "authorised" },
      { from: "proc",  to: "ship",    label: "" },
      { from: "proc",  to: "track",   label: "" },
      { from: "ship",  to: "deliver", label: "" },
      { from: "track", to: "deliver", label: "" },
      { from: "inv",   to: "err",     label: "out of stock", color: "rose" },
      { from: "pay",   to: "err",     label: "declined",     color: "rose" },
    ],
  },

  "Dev Sprint": {
    nodes: [
      { id: "plan",   label: "Sprint Planning",  x: 60,  y: 220, status: "completed", type: "trigger",  assignee: "Peo",          duration: "2h",    desc: "Team selects backlog items, sets story points and sprint goal." },
      { id: "dev",    label: "Development",      x: 280, y: 140, status: "completed", type: "process",  assignee: "Jake Thompson", duration: "5 days",desc: "Engineers implement features, write unit tests and push PRs." },
      { id: "review", label: "Code Review",      x: 280, y: 310, status: "active",    type: "process",  assignee: "Sarah Chen",   duration: "~6h",   desc: "Peer review using GitHub PRs. Must have 2 approvals before merge." },
      { id: "qa",     label: "QA Testing",       x: 500, y: 220, status: "active",    type: "process",  assignee: "Aisha Patel",  duration: "~1 day",desc: "Functional, regression and accessibility tests on staging." },
      { id: "stage",  label: "Staging Deploy",   x: 720, y: 140, status: "pending",   type: "process",  assignee: "Marcus Rivera", duration: "—",    desc: "CI/CD pipeline deploys to staging environment for final sign-off." },
      { id: "demo",   label: "Sprint Demo",      x: 720, y: 310, status: "pending",   type: "process",  assignee: "Peo",          duration: "1h",    desc: "Team demonstrates completed features to stakeholders." },
      { id: "prod",   label: "Production",       x: 940, y: 220, status: "pending",   type: "end",      assignee: "DevOps Bot",   duration: "—",     desc: "Blue/green deployment to production. Automatic rollback on errors." },
      { id: "block",  label: "Blocked",          x: 500, y: 390, status: "idle",      type: "error",    assignee: "Peo",          duration: "—",     desc: "Impediments raised during standup. Scrum master resolves blockers." },
    ],
    edges: [
      { from: "plan",   to: "dev",    label: "" },
      { from: "plan",   to: "review", label: "" },
      { from: "dev",    to: "qa",     label: "" },
      { from: "review", to: "qa",     label: "approved" },
      { from: "qa",     to: "stage",  label: "passed" },
      { from: "qa",     to: "demo",   label: "" },
      { from: "stage",  to: "prod",   label: "" },
      { from: "demo",   to: "prod",   label: "sign-off" },
      { from: "review", to: "block",  label: "changes req.", color: "rose" },
      { from: "qa",     to: "block",  label: "failed",       color: "rose" },
    ],
  },

  "Invoice Approval": {
    nodes: [
      { id: "sub",      label: "Invoice Submitted", x: 60,  y: 220, status: "completed", type: "trigger",  assignee: "Supplier",     duration: "—",    desc: "Supplier uploads invoice PDF via the vendor portal." },
      { id: "ocr",      label: "OCR Extraction",    x: 270, y: 220, status: "completed", type: "process",  assignee: "AI Engine",    duration: "2.1s", desc: "Extracts line items, amounts and vendor ID using computer vision." },
      { id: "match",    label: "PO Matching",       x: 490, y: 140, status: "completed", type: "process",  assignee: "FinanceBot",   duration: "0.8s", desc: "Matches invoice against approved Purchase Orders in the ERP." },
      { id: "review",   label: "Manager Review",    x: 490, y: 310, status: "active",    type: "process",  assignee: "Lena Müller",  duration: "~2h",  desc: "Finance manager reviews and approves invoices above $500." },
      { id: "approve",  label: "Auto Approved",     x: 710, y: 140, status: "completed", type: "process",  assignee: "System",       duration: "< 1s", desc: "Invoices under $500 from whitelisted vendors are auto-approved." },
      { id: "pay",      label: "Payment Released",  x: 930, y: 220, status: "pending",   type: "end",      assignee: "PaymentBot",   duration: "—",    desc: "Bank transfer initiated. Confirmation emailed to vendor." },
      { id: "reject",   label: "Rejected",          x: 710, y: 390, status: "idle",      type: "error",    assignee: "Lena Müller",  duration: "—",    desc: "Invoice rejected with reason. Vendor notified with dispute form." },
    ],
    edges: [
      { from: "sub",    to: "ocr",    label: "" },
      { from: "ocr",    to: "match",  label: "" },
      { from: "ocr",    to: "review", label: "> $500" },
      { from: "match",  to: "approve",label: "matched" },
      { from: "review", to: "pay",    label: "approved" },
      { from: "approve",to: "pay",    label: "" },
      { from: "match",  to: "reject", label: "mismatch", color: "rose" },
      { from: "review", to: "reject", label: "declined", color: "rose" },
    ],
  },
};

// ─── Status styles ─────────────────────────────────────────
const STATUS = {
  completed: { ring: "ring-emerald-400",  bg: "bg-emerald-50 dark:bg-emerald-900/20",  icon: CheckCircle2, iconColor: "text-emerald-500",  label: "Completed", dot: "bg-emerald-500" },
  active:    { ring: "ring-indigo-500",   bg: "bg-indigo-50 dark:bg-indigo-900/20",    icon: Clock,        iconColor: "text-indigo-500",   label: "In Progress", dot: "bg-indigo-500 animate-pulse" },
  pending:   { ring: "ring-slate-200 dark:ring-slate-700",   bg: "bg-white dark:bg-slate-900", icon: Circle,       iconColor: "text-slate-300 dark:text-slate-600",  label: "Pending", dot: "bg-slate-300 dark:bg-slate-600" },
  blocked:   { ring: "ring-rose-400",     bg: "bg-rose-50 dark:bg-rose-900/20",        icon: AlertCircle,  iconColor: "text-rose-500",     label: "Blocked", dot: "bg-rose-500" },
  idle:      { ring: "ring-slate-200 dark:ring-slate-700",   bg: "bg-white dark:bg-slate-900", icon: Circle,       iconColor: "text-slate-300 dark:text-slate-600",  label: "Idle", dot: "bg-slate-300 dark:bg-slate-600" },
  error:     { ring: "ring-rose-400",     bg: "bg-rose-50 dark:bg-rose-900/20",        icon: AlertCircle,  iconColor: "text-rose-500",     label: "Error", dot: "bg-rose-500" },
};

const TYPE_STYLES = {
  trigger: "border-l-4 border-l-emerald-500",
  process: "border-l-4 border-l-indigo-500",
  end:     "border-l-4 border-l-slate-400 dark:border-l-slate-600",
  error:   "border-l-4 border-l-rose-500",
};

// ─── SVG Edge ──────────────────────────────────────────────
function Edge({ fromNode, toNode, label, color }) {
  const fx = fromNode.x + NODE_W;
  const fy = fromNode.y + NODE_H / 2;
  const tx = toNode.x;
  const ty = toNode.y + NODE_H / 2;
  const cx1 = fx + (tx - fx) * 0.5;
  const cy1 = fy;
  const cx2 = fx + (tx - fx) * 0.5;
  const cy2 = ty;

  const isRose = color === "rose";
  const strokeColor = isRose ? "#f43f5e" : "#6366f1";
  const midX = (fx + tx) / 2;
  const midY = (fy + ty) / 2;
  const arrowId = `arrow-${fromNode.id}-${toNode.id}`;

  return (
    <g>
      <defs>
        <marker id={arrowId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={strokeColor} />
        </marker>
      </defs>
      <path
        d={`M ${fx} ${fy} C ${cx1} ${cy1} ${cx2} ${cy2} ${tx} ${ty}`}
        stroke={strokeColor}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={isRose ? "5 4" : "none"}
        markerEnd={`url(#${arrowId})`}
        opacity="0.7"
      />
      {label && (
        <text x={midX} y={midY - 6} textAnchor="middle" fontSize="9" fill={strokeColor} fontWeight="600" opacity="0.9">
          {label}
        </text>
      )}
    </g>
  );
}

// ─── Node Card ─────────────────────────────────────────────
function NodeCard({ node, selected, onClick }) {
  const s = STATUS[node.status] || STATUS.pending;
  const Icon = s.icon;

  return (
    <div
      onClick={() => onClick(node)}
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
      className={`absolute cursor-pointer select-none rounded-xl shadow-sm ring-2 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 ${s.ring} ${s.bg} ${TYPE_STYLES[node.type]} ${selected ? "ring-2 shadow-lg scale-105" : ""}`}
    >
      <div className="flex flex-col justify-center h-full px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className={`w-3 h-3 shrink-0 ${s.iconColor}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</span>
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{node.label}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{node.assignee}</p>
      </div>
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────
function DetailPanel({ node, onClose }) {
  if (!node) return null;
  const s = STATUS[node.status] || STATUS.pending;
  const Icon = s.icon;

  return (
    <div className="w-72 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Node Details</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5 flex-1">
        <div>
          <div className={`flex items-center gap-2 mb-2`}>
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{node.label}</h2>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{node.desc}</p>

        <div className="space-y-3">
          {[
            { icon: User,     label: "Assignee", value: node.assignee },
            { icon: Clock,    label: "Duration",  value: node.duration },
            { icon: Tag,      label: "Type",      value: node.type.charAt(0).toUpperCase() + node.type.slice(1) },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <Ic className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button className="w-full px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            Edit Node
          </button>
          <button className="w-full px-4 py-2.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
const ProcessFlow = () => {
  const [activeTemplate, setActiveTemplate] = useState("Supply Chain");
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [templateOpen, setTemplateOpen] = useState(false);
  const canvasRef = useRef(null);

  const workflow = WORKFLOWS[activeTemplate];
  const nodeMap = Object.fromEntries(workflow.nodes.map((n) => [n.id, n]));

  const handleZoomIn  = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));
  const handleFit     = () => setZoom(1);

  const selectNode = useCallback((node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const statusCounts = workflow.nodes.reduce((acc, n) => {
    acc[n.status] = (acc[n.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GitBranch className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Process Flow
          </h1>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-sm">Interactive visual workflow editor. Click any node to inspect it.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status legend */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            {[["completed","emerald","Completed"], ["active","indigo","Active"], ["pending","slate","Pending"], ["idle","slate","Error/Idle"]].map(([s, c, l]) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full bg-${c}-500`} />
                <span className="text-slate-500 dark:text-slate-400">{l}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{statusCounts[s] || 0}</span>
              </div>
            ))}
          </div>

          {/* Template selector */}
          <div className="relative">
            <button
              onClick={() => setTemplateOpen(!templateOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-indigo-500" />
              {activeTemplate}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${templateOpen ? "rotate-180" : ""}`} />
            </button>
            {templateOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                {Object.keys(WORKFLOWS).map((name) => (
                  <button
                    key={name}
                    onClick={() => { setActiveTemplate(name); setSelectedNode(null); setTemplateOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${activeTemplate === name ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-1 py-1">
            <button onClick={handleZoomOut} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleFit} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors" title="Reset zoom">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
            <Plus className="w-4 h-4" />
            Add Node
          </button>
        </div>
      </div>

      {/* ── Canvas + Detail Panel ── */}
      <div className="flex flex-1 min-h-0 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">

        {/* Canvas */}
        <div className="flex-1 overflow-auto" ref={canvasRef}>
          {/* Grid background */}
          <div
            className="relative"
            style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom, minWidth: "100%" }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: CANVAS_W,
                height: CANVAS_H,
              }}
            >
              {/* Dot grid */}
              <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0" style={{ zIndex: 0 }}>
                <defs>
                  <pattern id="grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" className="fill-slate-200 dark:fill-slate-700" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Edges */}
              <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0" style={{ zIndex: 1, pointerEvents: "none" }}>
                {workflow.edges.map((edge, i) => {
                  const from = nodeMap[edge.from];
                  const to   = nodeMap[edge.to];
                  if (!from || !to) return null;
                  return (
                    <Edge key={i} fromNode={from} toNode={to} label={edge.label} color={edge.color} />
                  );
                })}
              </svg>

              {/* Nodes */}
              <div className="absolute inset-0" style={{ zIndex: 2 }}>
                {workflow.nodes.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    selected={selectedNode?.id === node.id}
                    onClick={selectNode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>

      {/* ── Type legend ── */}
      <div className="flex items-center gap-4 mt-3 shrink-0 px-1 flex-wrap text-xs text-slate-400 dark:text-slate-500">
        {[
          ["border-l-emerald-500", "Trigger / Start"],
          ["border-l-indigo-500",  "Process Step"],
          ["border-l-slate-400",   "End State"],
          ["border-l-rose-500",    "Error Handler"],
        ].map(([cls, lbl]) => (
          <div key={lbl} className={`flex items-center gap-1.5`}>
            <div className={`w-4 h-3 rounded-sm border-l-2 bg-slate-100 dark:bg-slate-800 ${cls}`} />
            <span>{lbl}</span>
          </div>
        ))}
        <span className="ml-auto">Dashed lines = error paths</span>
      </div>
    </div>
  );
};

export default ProcessFlow;
