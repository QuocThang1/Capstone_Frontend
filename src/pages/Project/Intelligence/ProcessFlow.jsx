import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Plus, ZoomIn, ZoomOut, Maximize2,
  CheckCircle2, Clock, AlertCircle, Circle, X,
  User, Calendar, Tag, ChevronDown
} from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── Constants ────────────────────────────────────────────
const NODE_W = 160;
const NODE_H = 72;
const CANVAS_W = 1400;
const CANVAS_H = 520;

// ─── Workflow Templates ────────────────────────────────────
const WORKFLOWS = {
  "Supply Chain": {
    nodes: [
      { id: "recv", label: "Order Received", x: 60, y: 220, status: "completed", type: "trigger", assignee: "System", duration: "< 1s", desc: "Customer order captured from e-commerce API and queued for processing." },
      { id: "inv", label: "Inventory Check", x: 270, y: 140, status: "completed", type: "process", assignee: "InventoryBot", duration: "1.2s", desc: "Validates that all SKUs in the order have sufficient stock levels." },
      { id: "pay", label: "Payment Auth", x: 270, y: 310, status: "completed", type: "process", assignee: "PaymentGW", duration: "800ms", desc: "Authorises payment via Stripe. Captures on successful fulfilment." },
      { id: "proc", label: "Process Order", x: 490, y: 220, status: "active", type: "process", assignee: "Sarah Chen", duration: "~4 min", desc: "Warehouse picks and packs items. Barcode scan confirms each SKU." },
      { id: "ship", label: "Shipping Label", x: 710, y: 140, status: "pending", type: "process", assignee: "LogisticsBot", duration: "—", desc: "Generates carrier label (DHL/FedEx) and notifies the customer." },
      { id: "track", label: "Track & Notify", x: 710, y: 310, status: "pending", type: "process", assignee: "NotifyBot", duration: "—", desc: "Sends real-time tracking link via email and SMS to the customer." },
      { id: "deliver", label: "Delivered", x: 930, y: 220, status: "pending", type: "end", assignee: "—", duration: "—", desc: "Order confirmed delivered. Triggers post-purchase review request." },
      { id: "err", label: "Error Handler", x: 490, y: 390, status: "idle", type: "error", assignee: "Jake Thompson", duration: "—", desc: "Catches failed inventory or payment steps and alerts the ops team." },
    ],
    edges: [
      { from: "recv", to: "inv", label: "" },
      { from: "recv", to: "pay", label: "" },
      { from: "inv", to: "proc", label: "in stock" },
      { from: "pay", to: "proc", label: "authorised" },
      { from: "proc", to: "ship", label: "" },
      { from: "proc", to: "track", label: "" },
      { from: "ship", to: "deliver", label: "" },
      { from: "track", to: "deliver", label: "" },
      { from: "inv", to: "err", label: "out of stock", color: "rose" },
      { from: "pay", to: "err", label: "declined", color: "rose" },
    ],
  },

  "Dev Sprint": {
    nodes: [
      { id: "plan", label: "Sprint Planning", x: 60, y: 220, status: "completed", type: "trigger", assignee: "Peo", duration: "2h", desc: "Team selects backlog items, sets story points and sprint goal." },
      { id: "dev", label: "Development", x: 280, y: 140, status: "completed", type: "process", assignee: "Jake Thompson", duration: "5 days", desc: "Engineers implement features, write unit tests and push PRs." },
      { id: "review", label: "Code Review", x: 280, y: 310, status: "active", type: "process", assignee: "Sarah Chen", duration: "~6h", desc: "Peer review using GitHub PRs. Must have 2 approvals before merge." },
      { id: "qa", label: "QA Testing", x: 500, y: 220, status: "active", type: "process", assignee: "Aisha Patel", duration: "~1 day", desc: "Functional, regression and accessibility tests on staging." },
      { id: "stage", label: "Staging Deploy", x: 720, y: 140, status: "pending", type: "process", assignee: "Marcus Rivera", duration: "—", desc: "CI/CD pipeline deploys to staging environment for final sign-off." },
      { id: "demo", label: "Sprint Demo", x: 720, y: 310, status: "pending", type: "process", assignee: "Peo", duration: "1h", desc: "Team demonstrates completed features to stakeholders." },
      { id: "prod", label: "Production", x: 940, y: 220, status: "pending", type: "end", assignee: "DevOps Bot", duration: "—", desc: "Blue/green deployment to production. Automatic rollback on errors." },
      { id: "block", label: "Blocked", x: 500, y: 390, status: "idle", type: "error", assignee: "Peo", duration: "—", desc: "Impediments raised during standup. Scrum master resolves blockers." },
    ],
    edges: [
      { from: "plan", to: "dev", label: "" },
      { from: "plan", to: "review", label: "" },
      { from: "dev", to: "qa", label: "" },
      { from: "review", to: "qa", label: "approved" },
      { from: "qa", to: "stage", label: "passed" },
      { from: "qa", to: "demo", label: "" },
      { from: "stage", to: "prod", label: "" },
      { from: "demo", to: "prod", label: "sign-off" },
      { from: "review", to: "block", label: "changes req.", color: "rose" },
      { from: "qa", to: "block", label: "failed", color: "rose" },
    ],
  },

  "Invoice Approval": {
    nodes: [
      { id: "sub", label: "Invoice Submitted", x: 60, y: 220, status: "completed", type: "trigger", assignee: "Supplier", duration: "—", desc: "Supplier uploads invoice PDF via the vendor portal." },
      { id: "ocr", label: "OCR Extraction", x: 270, y: 220, status: "completed", type: "process", assignee: "AI Engine", duration: "2.1s", desc: "Extracts line items, amounts and vendor ID using computer vision." },
      { id: "match", label: "PO Matching", x: 490, y: 140, status: "completed", type: "process", assignee: "FinanceBot", duration: "0.8s", desc: "Matches invoice against approved Purchase Orders in the ERP." },
      { id: "review", label: "Manager Review", x: 490, y: 310, status: "active", type: "process", assignee: "Lena Müller", duration: "~2h", desc: "Finance manager reviews and approves invoices above $500." },
      { id: "approve", label: "Auto Approved", x: 710, y: 140, status: "completed", type: "process", assignee: "System", duration: "< 1s", desc: "Invoices under $500 from whitelisted vendors are auto-approved." },
      { id: "pay", label: "Payment Released", x: 930, y: 220, status: "pending", type: "end", assignee: "PaymentBot", duration: "—", desc: "Bank transfer initiated. Confirmation emailed to vendor." },
      { id: "reject", label: "Rejected", x: 710, y: 390, status: "idle", type: "error", assignee: "Lena Müller", duration: "—", desc: "Invoice rejected with reason. Vendor notified with dispute form." },
    ],
    edges: [
      { from: "sub", to: "ocr", label: "" },
      { from: "ocr", to: "match", label: "" },
      { from: "ocr", to: "review", label: "> $500" },
      { from: "match", to: "approve", label: "matched" },
      { from: "review", to: "pay", label: "approved" },
      { from: "approve", to: "pay", label: "" },
      { from: "match", to: "reject", label: "mismatch", color: "rose" },
      { from: "review", to: "reject", label: "declined", color: "rose" },
    ],
  },
};

// ─── Status styles ─────────────────────────────────────────
const STATUS = {
  completed: { ring: "ring-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle2, iconColor: "text-emerald-500", label: "Completed", dot: "bg-emerald-500" },
  active: { ring: "ring-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: Clock, iconColor: "text-indigo-500", label: "In Progress", dot: "bg-indigo-500 animate-pulse" },
  pending: { ring: "ring-slate-200 dark:ring-slate-700", bg: "bg-white dark:bg-slate-900", icon: Circle, iconColor: "text-slate-300 dark:text-slate-600", label: "Pending", dot: "bg-slate-300 dark:bg-slate-600" },
  blocked: { ring: "ring-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", icon: AlertCircle, iconColor: "text-rose-500", label: "Blocked", dot: "bg-rose-500" },
  idle: { ring: "ring-slate-200 dark:ring-slate-700", bg: "bg-white dark:bg-slate-900", icon: Circle, iconColor: "text-slate-300 dark:text-slate-600", label: "Idle", dot: "bg-slate-300 dark:bg-slate-600" },
  error: { ring: "ring-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", icon: AlertCircle, iconColor: "text-rose-500", label: "Error", dot: "bg-rose-500" },
};

const TYPE_STYLES = {
  trigger: "border-l-4 border-l-emerald-500",
  process: "border-l-4 border-l-indigo-500",
  end: "border-l-4 border-l-slate-400 dark:border-l-slate-600",
  error: "border-l-4 border-l-rose-500",
};

// ─── SVG Edge ──────────────────────────────────────────────
// ... (Giữ nguyên phần import và constants bên trên)

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
        className="opacity-40"
      />
      {label && (
        <g transform={`translate(${midX}, ${midY - 10})`}>
          <text textAnchor="middle" fontSize="10" fill={strokeColor} className="font-bold select-none">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Detail Panel ──────────────────────────────────────────
function DetailPanel({ node, onClose }) {
  if (!node) return null;
  const s = STATUS[node.status] || STATUS.pending;

  return (
    <motion.div 
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl z-20"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Node Details</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {node.label}
          </h2>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
          "{node.desc}"
        </p>

        <div className="space-y-4">
          {[
            { icon: User, label: "Assignee", value: node.assignee },
            { icon: Clock, label: "Duration", value: node.duration },
            { icon: Tag, label: "Type", value: node.type.toUpperCase() },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 transition-colors group-hover:border-indigo-300">
                <Ic className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button className="w-full px-4 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            Edit Node Configuration
          </button>
          <button className="w-full px-4 py-3 text-sm font-bold bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            View Activity Logs
          </button>
        </div>
      </div>
    </motion.div>
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

  const selectNode = useCallback((node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] font-sans antialiased">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 shrink-0 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            TASKA Flow
          </h1>
          <p className="mt-1 text-slate-400 font-medium text-sm">Universal Process Intelligence & Visual Logic</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setTemplateOpen(!templateOpen)}
              className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {activeTemplate}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${templateOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {templateOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2"
                >
                  {Object.keys(WORKFLOWS).map((name) => (
                    <button
                      key={name}
                      onClick={() => { setActiveTemplate(name); setSelectedNode(null); setTemplateOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors ${activeTemplate === name ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold" : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-2 hover:text-indigo-500 transition-colors"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-[10px] font-black w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="p-2 hover:text-indigo-500 transition-colors"><ZoomIn className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex flex-1 min-h-0 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 shadow-inner relative">
        <div className="flex-1 overflow-auto custom-scrollbar" ref={canvasRef}>
          <div 
            className="relative transition-transform duration-200 ease-out" 
            style={{ 
              width: CANVAS_W, 
              height: CANVAS_H, 
              transform: `scale(${zoom})`, 
              transformOrigin: '0 0',
              padding: '100px' 
            }}
          >
            {/* Grid */}
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-20">
              <defs>
                <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" className="fill-slate-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>

            {/* Edges */}
            <svg width="100%" height="100%" className="absolute inset-0 z-0 overflow-visible">
              {workflow.edges.map((edge, i) => (
                <Edge key={i} fromNode={nodeMap[edge.from]} toNode={nodeMap[edge.to]} label={edge.label} color={edge.color} />
              ))}
            </svg>

            {/* Nodes */}
            <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
              {workflow.nodes.map((node) => (
                <NodeCard key={node.id} node={node} selected={selectedNode?.id === node.id} onClick={selectNode} />
              ))}
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {selectedNode && <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessFlow;