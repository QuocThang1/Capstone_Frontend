import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Zap, Bell, Activity, Save, Settings2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { updateProjectApi } from "../../../../utils/Api/projectApi";
import ButtonSpinner from "../../../../components/ButtonSpinner";
import SelectDropdown from "../../../../components/selectDropdown";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer shadow-inner ${enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

// Hàm Bóc Tách chuỗi Cron Backend trả về hiển thị lên UI
const parseNotificationCron = (cronStr) => {
  if (!cronStr) return { hour: 7, minute: 45 };
  const parts = cronStr.split(' ');
  if (parts.length >= 2) {
    return { minute: parseInt(parts[0]) || 0, hour: parseInt(parts[1]) || 0 };
  }
  return { hour: 7, minute: 45 };
};

const parseBottleneckCron = (cronStr) => {
  if (!cronStr) return { type: 'minutes', value: 30 };
  const parts = cronStr.split(' ');
  if (parts[0].includes('/')) {
    return { type: 'minutes', value: parseInt(parts[0].split('/')[1]) || 30 };
  } else if (parts[1] && parts[1].includes('/')) {
    return { type: 'hours', value: parseInt(parts[1].split('/')[1]) || 1 };
  }
  return { type: 'minutes', value: 30 };
};

const AutomationRules = () => {
  const { project, fetchProjectData } = useOutletContext();
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [loadingBottle, setLoadingBottle] = useState(false);

  // States Notification
  const [isNotificationActive, setIsNotificationActive] = useState(true);
  const [notifHour, setNotifHour] = useState(7);
  const [notifMinute, setNotifMinute] = useState(45);

  // States Bottleneck
  const [isBottleneckActive, setIsBottleneckActive] = useState(true);
  const [bottleType, setBottleType] = useState('minutes');
  const [bottleValue, setBottleValue] = useState(30);

  const hourOptions = [...Array(24).keys()].map(h => ({
    value: h,
    label: `${h.toString().padStart(2, '0')} (Hour)`
  }));

  const minuteOptions = [0, 15, 30, 45].map(m => ({
    value: m,
    label: `${m.toString().padStart(2, '0')} (Minute)`
  }));

  const bottleTypeOptions = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' }
  ];

  // Điền dữ liệu từ Project Layout Context vào Form
  useEffect(() => {
    if (project) {
      setIsNotificationActive(project.isNotificationActive ?? true);
      const parsedNotif = parseNotificationCron(project.notificationCron);
      setNotifHour(parsedNotif.hour);
      setNotifMinute(parsedNotif.minute);

      setIsBottleneckActive(project.isBottleneckActive ?? true);
      const parsedBottle = parseBottleneckCron(project.bottleneckCron);
      setBottleType(parsedBottle.type);
      setBottleValue(parsedBottle.value);
    }
  }, [project]);

  const handleSave = async (engineName) => {
    if (engineName === 'notification') setLoadingNotif(true);
    else setLoadingBottle(true);

    try {
      let payload = {};
      if (engineName === 'notification') {
        payload = {
          isNotificationActive,
          notifHour: Number(notifHour),
          notifMinute: Number(notifMinute)
        };
      } else {
        payload = {
          isBottleneckActive,
          bottleType,
          bottleValue: Number(bottleValue)
        };
      }

      const res = await updateProjectApi(project._id, payload);
      if (res && res.EC === 0) {
        toast.success(`${engineName === 'notification' ? 'Notification Alert' : 'Bottleneck AI'} Engine updated!`);
        if (fetchProjectData) await fetchProjectData(); // Xoay vòng tải lại để đồng bộ Context Layout
      } else {
        toast.error(res.EM || "Update failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || "Error saving automation settings.");
    } finally {
      setLoadingNotif(false);
      setLoadingBottle(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
            Automation Engine
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Configure system background jobs, Smart Notifications, and AI Bottleneck Scanner.
          </p>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* ---------- DEADLINE PUSH NOTIFICATION CARD ---------- */}
        <motion.div variants={item} className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-all flex flex-col ${isNotificationActive ? "border-indigo-200 dark:border-indigo-800" : "border-slate-200 dark:border-slate-800 opacity-80 scale-[0.99]"}`}>
          <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isNotificationActive ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Smart Notifications</h3>
                <p className="text-xs font-semibold text-slate-500">Auto Push Deadline Alerts</p>
              </div>
            </div>
            <Toggle enabled={isNotificationActive} onToggle={() => setIsNotificationActive(!isNotificationActive)} />
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Sends automated push notifications and warnings to assignees whose tickets are due or overdue at a specific time each day.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Execute Time (24H)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className={!isNotificationActive ? "opacity-50 pointer-events-none" : ""}>
                      <SelectDropdown
                        value={Number(notifHour)}
                        options={hourOptions}
                        onChange={(val) => setNotifHour(val)}
                        placeholder="Hour"
                      />
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-400">:</span>
                  <div className="flex-1">
                    <div className={!isNotificationActive ? "opacity-50 pointer-events-none" : ""}>
                      <SelectDropdown
                        value={Number(notifMinute)}
                        options={minuteOptions}
                        onChange={(val) => setNotifMinute(val)}
                        placeholder="Minute"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave('notification')}
              disabled={loadingNotif}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-70 shadow-md shadow-indigo-500/20"
            >
              {loadingNotif ? <ButtonSpinner text="Saving..." /> : <><Save className="w-4 h-4" /> Save Configuration</>}
            </button>
          </div>
        </motion.div>

        {/* ---------- BOTTLENECK SCANNER CARD ---------- */}
        <motion.div variants={item} className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col ${isBottleneckActive ? "border-rose-200 dark:border-rose-800" : "border-slate-200 dark:border-slate-800 opacity-80 scale-[0.99]"}`}>
          <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isBottleneckActive ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Bottleneck Engine</h3>
                <p className="text-xs font-semibold text-slate-500">Live AI Flow Scanning</p>
              </div>
            </div>
            <Toggle enabled={isBottleneckActive} onToggle={() => setIsBottleneckActive(!isBottleneckActive)} />
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Activates an automated CRON trigger that deeply checks your workflow board to identify stalled tickets, calculating wait times against bottlenecks limits.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Scan Frequency</label>
                <div className="flex items-center gap-4">
                  <div className="flex-[2]">
                    <input
                      type="number"
                      min="1"
                      value={bottleValue}
                      onChange={e => setBottleValue(e.target.value)}
                      disabled={!isBottleneckActive}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none transition-all disabled:opacity-50"
                      placeholder="Ex: 30"
                    />
                  </div>
                  <div className="flex-[3]">
                    <div className={!isBottleneckActive ? "opacity-50 pointer-events-none" : ""}>
                      <SelectDropdown
                        value={bottleType}
                        options={bottleTypeOptions}
                        onChange={(val) => setBottleType(val)}
                        placeholder="Unit"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-medium text-slate-500">Cron will trigger automatically every {bottleValue || 0} {bottleType}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave('bottleneck')}
              disabled={loadingBottle}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-70 shadow-md shadow-rose-500/20"
            >
              {loadingBottle ? <ButtonSpinner text="Saving..." /> : <><Save className="w-4 h-4" /> Save Configuration</>}
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AutomationRules;