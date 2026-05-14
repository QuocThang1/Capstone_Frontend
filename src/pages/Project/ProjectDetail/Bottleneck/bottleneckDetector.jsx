import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

import { getBottlenecksByProjectApi } from '../../../../utils/Api/bottleneckApi';
import BottleneckCard from '../../../../components/projectPage/Bottleneck/bottleneckCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const BottleneckDetector = () => {
  const { project, socket } = useOutletContext();
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchBottlenecks = async () => {
    setLoading(true);
    try {
      const res = await getBottlenecksByProjectApi(project._id);
      if (res && res.EC === 0) {
        setBottlenecks(res.data);
      }
    } catch (error) {
      console.error("Failed to load bottlenecks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) fetchBottlenecks();
  }, [project?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBottleneck = (newBottleneck) => {
      console.log("Realtime Bottleneck received!", newBottleneck);
      toast.warn(`New Bottleneck Detected: ${newBottleneck.name}`, { theme: "colored" });
      fetchBottlenecks();
    };

    socket.on('bottleneck_alert', handleNewBottleneck);
    return () => socket.off('bottleneck_alert', handleNewBottleneck);
  }, [socket, project?._id]);

  const activeCount = bottlenecks.filter(b => !b.isResolved).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6"
    >
      <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" />
            Bottleneck Detector
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Real-time flow analysis to identify blockers and inefficiencies.
          </p>
        </div>
      </motion.header>

      {loading ? (
        <motion.div variants={itemVariants} className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </motion.div>
      ) : bottlenecks.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 py-16 px-6 text-center rounded-2xl flex flex-col items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No bottlenecks detected</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Your project workflow is running smoothly right now. System is actively listening for potential blockages.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="text-sm font-semibold text-slate-500 mb-4 px-1">{activeCount} active issues require attention</div>
          <AnimatePresence>
            {bottlenecks.map((bn) => (
              <BottleneckCard
                key={bn._id}
                bn={bn}
                expanded={expandedId}
                onToggle={setExpandedId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BottleneckDetector;