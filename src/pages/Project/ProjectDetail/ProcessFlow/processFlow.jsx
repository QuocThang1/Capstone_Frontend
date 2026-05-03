import { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  GitBranch, CheckCircle2, Circle,
  ChevronDown, Plus, Save, Trash2, Edit, ArrowRight
} from 'lucide-react';

import {
  getWorkflowsByProjectApi,
  updateWorkflowApi,
  applyWorkflowToProjectApi,
  createWorkflowApi,
  deleteWorkflowApi
} from '../../../../utils/Api/workflowApi';
import Spinner from '../../../../components/spinner';
import CreateProcessflowModal from './createProcessflowModal';
import DeleteProcessflowModal from './deleteProcessflowModal';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

// Custom hook to detect outside clicks
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const NODE_W = 180, NODE_H = 80;
const STATUS_STYLES = {
  default: { ring: "ring-slate-300 dark:ring-slate-700", bg: "bg-slate-50 dark:bg-slate-800/50", icon: Circle, iconColor: "text-slate-400" },
  selected: { ring: "ring-indigo-500 ring-2", bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: CheckCircle2, iconColor: "text-indigo-500" },
  target: { ring: "ring-emerald-500 ring-2", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: GitBranch, iconColor: "text-emerald-500" },
};

function Edge({ fromNode, toNode }) {
  const fx = fromNode.x + NODE_W / 2;
  const fy = fromNode.y + NODE_H;
  const tx = toNode.x + NODE_W / 2;
  const ty = toNode.y;

  const endPadding = 10;
  const angle = Math.atan2(ty - (fy + 60), tx - fx);
  const paddedTx = tx - endPadding * Math.cos(angle);
  const paddedTy = ty - endPadding * Math.sin(angle);

  const pathData = `M ${fx},${fy} C ${fx},${fy + 60} ${tx},${ty - 60} ${paddedTx},${paddedTy}`;

  return (
    <path
      d={pathData}
      stroke="#6366f1"
      strokeWidth="2"
      fill="none"
      markerEnd="url(#arrowhead)"
      className="opacity-60"
    />
  );
}

function NodeCard({ node, style, onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="absolute group transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
    >
      <div className={`w-full h-full rounded-xl ring-1 flex items-center p-4 gap-4 transition-all ${style.ring} ${style.bg}`}>
        <div className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center">
          <style.icon className={`w-6 h-6 transition-colors ${style.iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{node.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Workflow Step</p>
        </div>
      </div>
    </motion.div>
  );
}

const ProcessFlow = () => {
  const { project, fetchProjectData } = useOutletContext();
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await getWorkflowsByProjectApi(project._id);
      if (res && res.EC === 0) {
        const fetchedWorkflows = res.data;
        setWorkflows(fetchedWorkflows);

        const activeId = project.activeWorkflowId?._id || project.activeWorkflowId;

        setActiveWorkflow(fetchedWorkflows.find(w => w._id === activeId) || null);
      } else toast.error(res.EM || "Failed to fetch workflows.");
    } catch (error) {
      toast.error(error?.response?.data?.EM || "An error occurred.");
    } finally { setLoading(false); }
  }, [project._id, project.activeWorkflowId]);

  useEffect(() => {
    setLoading(true);
    fetchWorkflows();
  }, [fetchWorkflows]);

  const generateNodes = useCallback(() => {
    if (!project?.boardColumns) return [];
    const columns = [...project.boardColumns].sort((a, b) => a.order - b.order);
    const totalWidth = columns.length * (NODE_W + 80);
    const canvasWidth = Math.max(1200, totalWidth);
    const initialX = (canvasWidth - totalWidth + 80) / 2;
    return columns.map((col, index) => ({ id: col.name, name: col.name, x: initialX + index * (NODE_W + 80), y: 200 }));
  }, [project.boardColumns]);

  useEffect(() => {
    const newNodes = generateNodes();
    setNodes(newNodes);
    if (activeWorkflow) {
      const nodeMap = new Map(newNodes.map(n => [n.id, n]));
      const newEdges = [];
      activeWorkflow.transitions.forEach(t => {
        const fromNode = nodeMap.get(t.from);
        if (fromNode) {
          t.to.forEach(toName => {
            const toNode = nodeMap.get(toName);
            if (toNode) newEdges.push({ from: fromNode, to: toNode, id: `${t.from}->${toName}` });
          });
        }
      });
      setEdges(newEdges);
    } else setEdges([]);
  }, [activeWorkflow, project.boardColumns, generateNodes]);

  const handleNodeClick = (node) => {
    if (!isEditing) return;
    if (!selectedNode) setSelectedNode(node);
    else if (selectedNode.id === node.id) setSelectedNode(null);
    else {
      const currentTransitions = activeWorkflow.transitions.find(t => t.from === selectedNode.id);
      const newTos = currentTransitions ? [...currentTransitions.to] : [];
      const toIndex = newTos.indexOf(node.id);
      if (toIndex > -1) newTos.splice(toIndex, 1);
      else newTos.push(node.id);
      const newTransitions = activeWorkflow.transitions.map(t => t.from === selectedNode.id ? { ...t, to: newTos } : t);
      if (!currentTransitions) newTransitions.push({ from: selectedNode.id, to: newTos });
      setActiveWorkflow({ ...activeWorkflow, transitions: newTransitions });
    }
  };

  const handleApplyWorkflow = async (workflowId) => {
    try {
      const res = await applyWorkflowToProjectApi(project._id, workflowId);
      if (res && res.EC === 0) {
        toast.success("Workflow applied successfully!");
        await fetchProjectData();
        setActiveWorkflow(workflows.find(w => w._id === workflowId) || null);
      } else toast.error(res.EM || "Failed to apply workflow.");
    } catch (error) { toast.error(error?.response?.data?.EM || "An error occurred."); }
  };

  const handleSaveWorkflow = async () => {
    if (!isEditing || !activeWorkflow) return;
    setActionLoading(true);
    try {
      const res = await updateWorkflowApi(activeWorkflow._id, { transitions: activeWorkflow.transitions });
      if (res && res.EC === 0) {
        toast.success("Workflow saved!");
        setIsEditing(false);
        setSelectedNode(null);
        fetchWorkflows();
      } else toast.error(res.EM || "Failed to save workflow.");
    } catch (error) { toast.error(error?.response?.data?.EM || "An error occurred."); }
    finally { setActionLoading(false); }
  };

  const handleCreateWorkflow = async (data) => {
    setActionLoading(true);
    try {
      const res = await createWorkflowApi(project._id, { name: data.name, transitions: [] });
      if (res && res.EC === 0) {
        toast.success("Workflow created!");
        setCreateModalOpen(false);
        fetchWorkflows();
      } else toast.error(res.EM || "Failed to create workflow.");
    } catch (error) { toast.error(error?.response?.data?.EM || "An error occurred."); }
    finally { setActionLoading(false); }
  };

  const handleDeleteWorkflow = async () => {
    if (!workflowToDelete) return;
    setActionLoading(true);
    try {
      const res = await deleteWorkflowApi(workflowToDelete._id);
      if (res && res.EC === 0) {
        toast.success("Workflow deleted!");
        setDeleteModalOpen(false);
        setWorkflowToDelete(null);
        if (activeWorkflow?._id === workflowToDelete._id) setActiveWorkflow(null);
        fetchWorkflows();
      } else toast.error(res.EM || "Failed to delete workflow.");
    } catch (error) { toast.error(error?.response?.data?.EM || "An error occurred."); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Spinner /></div>;

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col h-full font-sans antialiased p-4 md:p-6 bg-slate-50 dark:bg-slate-900"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 shrink-0 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-indigo-600" />
              Process flow Editor
            </h1>
            <p className="mt-1 text-slate-500 font-medium text-sm">Design and apply status transition rules for your project.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-64 gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer">
                <span className="truncate">{activeWorkflow ? activeWorkflow.name : "Select a Workflow"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl z-50 p-2">
                    {workflows.map((w) => (
                      <div key={w._id} className="flex items-center justify-between group rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <button onClick={() => { handleApplyWorkflow(w._id); setDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 cursor-pointer ${activeWorkflow?._id === w._id ? "text-indigo-600 font-bold" : "text-slate-600 dark:text-slate-300"}`}>
                          {activeWorkflow?._id === w._id && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                          {w.name}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setWorkflowToDelete(w); setDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Delete workflow">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                    <button onClick={() => setCreateModalOpen(true)} className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" /> Create New Workflow
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
          {activeWorkflow ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{activeWorkflow.name} - Transitions</h3>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSaveWorkflow} disabled={actionLoading} className="px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer disabled:bg-emerald-400"><Save className="w-4 h-4" /> {actionLoading ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => { setIsEditing(false); setSelectedNode(null); fetchWorkflows(); }} className="px-4 py-2 text-sm font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"><Edit className="w-4 h-4" /> Edit Transitions</button>
                  )}
                </div>
              </div>
              {/* Transition Table */}
              <div className="overflow-y-auto max-h-56 custom-scrollbar">
                <table className="w-full text-sm text-left table-fixed">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="w-1/3">
                        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3">From Status</div>
                      </th>
                      <th scope="col">
                        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3">To Statuses</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950">
                    {activeWorkflow.transitions.filter(t => t.to.length > 0).map((transition) => (
                      <tr key={transition.from} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {transition.from}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {transition.to.map(toStatus => (
                              <span key={toStatus} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                                <ArrowRight className="w-3 h-3" />
                                {toStatus}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activeWorkflow.transitions.filter(t => t.to.length > 0).length === 0 && (
                  <div className="bg-white dark:bg-slate-950">
                    <p className="text-center text-slate-500 py-8 text-sm">No transitions defined for this workflow. Click 'Edit Transitions' to start.</p>
                  </div>
                )}
              </div>
              {/* Visual Editor */}
              <div className="flex-1 w-full h-full overflow-auto custom-scrollbar border-t border-slate-200 dark:border-slate-800 relative">
                <motion.div layout className="relative" style={{ width: '100%', height: 450 }}>
                  <svg width="100%" height="100%" className="absolute inset-0 z-0 overflow-visible">
                    <defs>
                      <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" className="opacity-70" />
                      </marker>
                    </defs>
                    <AnimatePresence>
                      {edges.map(edge => <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={edge.id}><Edge fromNode={edge.from} toNode={edge.to} /></motion.g>)}
                    </AnimatePresence>
                  </svg>
                  <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 pt-12">
                    {nodes.map((node) => {
                      let style = STATUS_STYLES.default;
                      if (isEditing) {
                        if (selectedNode?.id === node.id) style = STATUS_STYLES.selected;
                        else if (selectedNode && activeWorkflow.transitions.find(t => t.from === selectedNode.id)?.to.includes(node.id)) style = STATUS_STYLES.target;
                      }
                      return <NodeCard key={node.id} node={node} style={style} onClick={() => handleNodeClick(node)} />;
                    })}
                  </motion.div>
                </motion.div>
              </div>
              {isEditing && (
                <div className="p-4 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">
                    {selectedNode ? `Editing transitions for "${selectedNode.name}". Click on other nodes to set them as possible next steps.` : "Select a node to start editing its transitions."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <GitBranch className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Workflow Applied</h3>
              <p className="text-slate-500 mt-2">Please select and apply a workflow from the dropdown to begin.</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <CreateProcessflowModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateWorkflow} loading={actionLoading} />
      <DeleteProcessflowModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteWorkflow} loading={actionLoading} workflow={workflowToDelete} />
    </>
  );
};

export default ProcessFlow;