import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, CheckCircle2, Info, AlertTriangle, Play, Pause } from "lucide-react";
import { format } from "date-fns";

// Mock hook for events data
const useListEvents = () => ({
  data: [
    { id: 1, type: "success", message: "Database backup completed", source: "System", timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 2, type: "warning", message: "High memory usage detected on server 3", source: "Monitor", timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 3, type: "success", message: "API deployment finished", source: "CI/CD", timestamp: new Date(Date.now() - 30 * 60000) },
    { id: 4, type: "error", message: "Failed to connect to cache", source: "Redis", timestamp: new Date(Date.now() - 45 * 60000) },
  ]
});

const TypeIcon = ({ type }) => {
  switch(type) {
    case 'error': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default: return <Info className="w-4 h-4 text-primary" />;
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

const EventRow = React.memo(({ event }) => (
  <div className="flex items-start gap-4 p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
    <div className="mt-1">
      <TypeIcon type={event.type} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-1">
        <TypeBadge type={event.type} />
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{format(new Date(event.timestamp), 'HH:mm:ss.SSS')}</span>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{event.source}</span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-100">{event.message}</p>
    </div>
  </div>
));

const RealTimeEventLog = () => {
  const { data: initialEvents = [] } = useListEvents();
  const [events, setEvents] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialEvents.length > 0 && events.length === 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  useEffect(() => {
    if (isPaused) return;

    const sources = ['NetworkMonitor', 'DB_Sync', 'AuthService', 'PaymentGateway', 'WorkflowEngine'];
    const types = ['info', 'info', 'info', 'success', 'warning', 'error'];
    const messages = [
      'Heartbeat OK', 'Cache refreshed successfully', 'User session renewed',
      'High latency detected on replica-2', 'Connection timeout after 5000ms',
      'Batch processing completed 450 records', 'Invalid payload signature'
    ];

    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date().toISOString()
        };
        return [newEvent, ...prev].slice(0, 100);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-600 dark:text-slate-400 font-display text-foreground tracking-tight flex items-center gap-3">
            Event Log
            <span className={`flex h-2.5 w-2.5 rounded-full animate-pulse ${
              isPaused 
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' 
                : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            }`} />
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">Real-time system operations and intelligence stream.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isPaused
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Output</span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">Showing {events.length} events</span>
        </div>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 scrollbar-thin">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Activity className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm font-medium">Waiting for data...</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {events.map(ev => <EventRow key={ev.id} event={ev} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeEventLog;

