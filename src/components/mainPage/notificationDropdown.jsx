import { useEffect, useState, useRef, useContext } from "react";
import { Bell, CalendarClock, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { AuthContext } from "../../context/auth.context";
import { getNotificationsApi, deleteNotificationApi } from "../../utils/Api/notificationApi";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { auth } = useContext(AuthContext);

    const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotificationsApi();
            if (res && res.EC === 0) {
                setNotifications(res.data);
            }
        } catch (error) {
            console.error("Lỗi tải thông báo: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Tải danh sách thông báo lần đầu
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchNotifications();
        }
    }, [auth.isAuthenticated]);

    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user?._id) return;

        const socket = io(SOCKET_SERVER_URL);

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            socket.emit("join_user_room", auth.user._id);
        });

        socket.on("new_notification", (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev]);

            toast.info(`New notification: ${newNotif.message}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        return () => {
            socket.emit("leave_user_room", auth.user._id);
            socket.disconnect();
            socket.off("new_notification");
        };
    }, [auth.isAuthenticated, auth.user?._id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await deleteNotificationApi(id);
            if (res && res.EC === 0) {
                setNotifications((prev) => prev.filter((n) => n._id !== id));
                toast.success(res.EM || "Notification deleted");
            } else {
                toast.error(res?.EM || "Failed to delete notification");
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Nút Chuông */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white dark:border-slate-900"></span>
                    </span>
                )}
            </button>

            {/* Modal / Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-[360px] md:w-[400px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-left"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-indigo-500" />
                                Notifications
                            </h3>
                            {notifications.length > 0 && (
                                <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full shadow-sm">
                                    {notifications.length} New
                                </span>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {loading && notifications.length === 0 ? (
                                <div className="p-8 flex justify-center text-slate-400">
                                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mb-3" />
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">You&apos;re all caught up!</p>
                                    <p className="text-xs mt-1">No new notifications right now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group relative flex gap-3"
                                        >
                                            <div className="shrink-0 mt-0.5">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                                    <CalendarClock className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 pr-8">
                                                <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                    {notif.issueId && (
                                                        <span className="font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                                                            {notif.issueId.issueKey}
                                                        </span>
                                                    )}
                                                    <span>
                                                        {new Date(notif.createdAt).toLocaleDateString("vi-VN", {
                                                            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(notif._id, e)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                                title="Delete notification"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;