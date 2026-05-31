import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, User as UserIcon, Briefcase } from 'lucide-react';

const getAvatarColor = (name) => {
    if (!name) return "bg-slate-200 text-slate-600";
    const colors = ["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length] + " text-white";
};

const MemberDetailModal = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) return null;

    const isProjectMemberFormat = !!member.accountId;
    const account = isProjectMemberFormat ? member.accountId : member;

    const { fullName, email, phone, dob, gender, skills } = account || {};
    const role = isProjectMemberFormat ? member.role : null;

    const avatarColorClass = getAvatarColor(fullName);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex justify-center items-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header Section: Avatar & Tên */}
                        <div className="relative p-6 pb-0">
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-start gap-5">
                                {/* Avatar */}
                                <div className={`w-20 h-20 rounded-2xl flex justify-center items-center text-3xl font-bold shadow-sm shrink-0 ${avatarColorClass}`}>
                                    {fullName ? fullName.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
                                </div>

                                {/* Thông tin chính */}
                                <div className="pt-1">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        {fullName || "Unknown User"}
                                    </h3>

                                    <div className="flex items-center gap-3 mt-2">
                                        {role && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold uppercase tracking-wide">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                {role}
                                            </span>
                                        )}
                                        {gender && (
                                            <span className="text-sm font-medium text-slate-500 capitalize">
                                                {gender}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body Section: Chi tiết */}
                        <div className="p-6 mt-4 flex flex-col gap-6">

                            {/* Bảng Thông tin liên hệ */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Contact Information
                                </h4>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Email Row */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 shrink-0">
                                            <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-medium text-slate-500">Email Address</span>
                                            {email ? (
                                                <a href={`mailto:${email}`} className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors">
                                                    {email}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Not provided</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone Row */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 shrink-0">
                                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-medium text-slate-500">Phone Number</span>
                                            {phone ? (
                                                <a href={`tel:${phone}`} className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    {phone}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Not provided</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* DOB Row */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-medium text-slate-500">Date of Birth</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {dob ? new Date(dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : <span className="text-slate-400 italic font-normal">Not provided</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Khu vực Kỹ năng */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                    Skills & Expertise
                                </h4>
                                {skills && skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                                        <p className="text-sm text-slate-500 italic">No skills have been added yet.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MemberDetailModal;