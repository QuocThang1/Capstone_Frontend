import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle2, Info, AlertTriangle, Play, Pause, Filter } from "lucide-react";
import { format, isToday } from "date-fns";
import { toast } from "react-toastify";
import { getHistoryByProjectApi } from "../../../../utils/Api/historyApi";
import { getSprintsByProjectApi } from "../../../../utils/Api/sprintApi";
import socket from "../../../../utils/socket";
import Spinner from "../../../../components/spinner";
import SelectDropdown from "../../../../components/selectDropdown";

// Animation cho layout tổng thể
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 250, damping: 24 } }
};

// Animation cho các row trong List
const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 }
};

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'error': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default: return <Info className="w-4 h-4 text-indigo-500" />;
  }
};

const TypeBadge = ({ type }) => {
  const styles = {
    error: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    warning: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    success: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    info: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[type] || styles.info}`}>
      {type}
    </span>
  );
};

const EventRow = React.memo(({ event }) => {
  const dateObj = new Date(event.timestamp);
  // Nếu event diễn ra hôm nay thì chỉ hiện giờ, ngược lại hiện cả ngày
  const displayTime = isToday(dateObj)
    ? format(dateObj, 'HH:mm:ss')
    : format(dateObj, 'dd/MM/yyyy HH:mm:ss');

  return (
    <motion.div variants={listItem} layout className="flex items-start gap-4 p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <div className="mt-1 flex-shrink-0">
        <TypeIcon type={event.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <TypeBadge type={event.type} />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {displayTime}
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded truncate max-w-[120px]">
            {event.source}
          </span>
          {event.issueKey && (
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 rounded">
              {event.issueKey}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-100 break-words">
          {event.message}
        </p>
      </div>
    </motion.div>
  );
});

// Hàm format giá trị (đặc biệt cho Start Date và Due Date)
const formatValue = (value, fieldName) => {
  if (value === null || value === 'Unassigned' || value === '') {
    return 'None';
  }

  if (fieldName === 'Start Date' || fieldName === 'Due Date') {
    try {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (e) {
      // fallback if error
    }
  }
  return value;
};

const formatHistoryToEvent = (history) => {
  let type = 'info';
  let message = '';

  if (history.field === 'Status') {
    if (history.newValue === 'Done') type = 'success';
  } else if (history.field === 'Issue Created') {
    type = 'success';
    message = `Created new issue: ${history.issueId?.title || 'Unknown'}`;
  } else if (history.field === 'Issue Deleted') {
    type = 'warning';
    message = `Deleted issue: ${history.oldValue}`;
  } else if (history.field === 'Priority' && history.newValue === 'High') {
    type = 'error';
  }

  const source = history.authorId?.fullName || "System";
  const issueKey = history.issueId?.issueKey || "";

  if (!message) {
    let oldVal = formatValue(history.oldValue, history.field);
    let newVal = formatValue(history.newValue, history.field);

    message = `Updated ${history.field} from "${oldVal}" to "${newVal}"`;
    if (history.issueId?.title) {
      message += ` on "${history.issueId.title}"`;
    }
  }

  return {
    id: history._id || Date.now().toString() + Math.random(),
    type,
    source,
    issueKey,
    message,
    timestamp: history.createdAt || new Date().toISOString()
  };
};

const TIME_FILTER_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: '1', label: 'Last 24 Hours' },
  { value: '3', label: 'Last 3 Days' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' }
];

const RealTimeEventLog = () => {
  const { project } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);

  // Sprint Filter States
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState('');
  const [selectedDays, setSelectedDays] = useState('');

  const isPausedRef = useRef(isPaused);

  // Đồng bộ state để dùng trong event kết nối socket
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Load list Sprints cho bộ lọc
  useEffect(() => {
    if (!project?._id) return;
    const fetchSprints = async () => {
      try {
        const res = await getSprintsByProjectApi(project._id);
        if (res?.EC === 0) setSprints(res.data || []);
      } catch (error) {
        console.error("Failed to load sprints for filters");
      }
    };
    fetchSprints();
  }, [project?._id]);

  const sprintOptions = [
    { value: '', label: 'All Sprints' },
    ...sprints.map(s => {
      const isBacklog = s.name?.toLowerCase() === 'backlog';
      const statusLabel = s.status ? ` (${s.status.charAt(0).toUpperCase() + s.status.slice(1)})` : '';
      return {
        value: s._id,
        label: isBacklog ? s.name : `${s.name}${statusLabel}`
      };
    })
  ];

  // Tải dữ liệu lịch sử
  useEffect(() => {
    if (!project?._id) return;

    setLoadingPage(true);
    const fetchInitialHistory = async () => {
      try {
        const params = {};
        if (selectedSprint) params.sprintId = selectedSprint;
        if (selectedDays) params.days = selectedDays;

        const res = await getHistoryByProjectApi(project._id, params);
        if (res.EC === 0 && res.data) {
          const formattedEvents = res.data.map(formatHistoryToEvent);
          const sortedEvents = formattedEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setEvents(sortedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        toast.error("Failed to fetch event history");
      } finally {
        setIsLoading(false);
        setLoadingPage(false);
      }
    };

    fetchInitialHistory();

    // 1. Join project history hoặc sprint history room
    const roomName = project._id;

    // 2. Lắng nghe lịch sử thay đổi real time
    const handleNewHistory = (newHistoryData) => {
      // Ngừng đẩy nếu User tạm dừng Event Stream
      if (isPausedRef.current) return;

      const newEvent = formatHistoryToEvent(newHistoryData);
      setEvents(prev => [newEvent, ...prev]);
    };
    if (selectedSprint) {
      socket.emit('join_sprint_history_room', selectedSprint);
      socket.on('new_sprint_history', handleNewHistory);
    } else {
      socket.emit('join_project_history_room', roomName);
      socket.on('new_project_history', handleNewHistory);
    }

    // Cleanup
    return () => {
      socket.off('new_project_history', handleNewHistory);
      socket.off('new_sprint_history', handleNewHistory);
      socket.emit('leave_project_history_room', roomName);
      if (selectedSprint) {
        socket.emit('leave_sprint_history_room', selectedSprint);
      }
    };
  }, [project?._id, selectedSprint, selectedDays]);

  if (loadingPage) return <div className="flex justify-center items-center h-full p-8"><Spinner /></div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-[calc(100vh-24px)] flex flex-col pt-4 pr-6 pl-2 pb-20" // Thêm padding căn viền giống backlog/processFlow
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 shrink-0 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-600" />
            Event Log
            <span className={`flex h-2.5 w-2.5 rounded-full animate-pulse ${isPaused
              ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
              : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              }`} />
          </h1>
          <p className="mt-1 text-slate-500 font-medium text-sm">Real-time system operations and intelligence stream.</p>
        </div>

        {/* Khu Vực Nút & Bộ Lọc */}
        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg shadow-sm w-44 shrink-0 px-2 py-1">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <SelectDropdown
              value={selectedSprint}
              options={sprintOptions}
              onChange={setSelectedSprint}
              placeholder="All Sprints"
              size="sm"
            />
          </div>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg shadow-sm w-40 shrink-0 px-2 py-1">
            <SelectDropdown
              value={selectedDays}
              options={TIME_FILTER_OPTIONS}
              onChange={setSelectedDays}
              placeholder="All Time"
              size="sm"
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm ${isPaused
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Output</span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">Showing {events.length} events</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Activity className="w-8 h-8 opacity-20 mb-3 animate-spin duration-1000" />
              <p className="text-sm font-medium">Loading history...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Activity className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm font-medium">No system events recorded yet.</p>
            </div>
          ) : (
            <motion.div
              variants={listContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              <AnimatePresence initial={false}>
                {events.map((ev) => (
                  <EventRow key={ev.id} event={ev} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RealTimeEventLog;