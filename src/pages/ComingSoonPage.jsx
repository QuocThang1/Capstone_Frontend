import { motion } from "framer-motion";
import { Link } from "wouter";
import { Bell } from "lucide-react";
import useDarkMode from "@/hooks/useDarkMode";

const ComingSoonPage = ({ featureName, icon: Icon, description }) => {
  const { isDark } = useDarkMode();

  const defaultDescription =
    "Chúng tôi đang hoàn thiện tính năng này để mang lại trải nghiệm phân tích quy trình tốt nhất cho bạn. Hãy chờ đợi thông báo chính thức từ TASKA.";

  return (
    <div className="w-full min-h-full bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background shimmer effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-96 bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-500/5 dark:from-indigo-400/10 dark:to-indigo-400/10 animate-pulse transition-colors duration-300" />
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full text-center space-y-8"
      >

        {/* Feature Icon Circle with Shimmer */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-32 h-32">
            {/* Shimmer background circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 dark:from-indigo-400/30 via-indigo-600/10 dark:via-indigo-400/15 to-indigo-600/20 dark:to-indigo-400/30 blur-xl transition-colors duration-300"
            />

            {/* Main circle */}
            <div className="absolute inset-0 rounded-full glass-card border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="w-16 h-16 text-indigo-600 dark:text-indigo-400 opacity-80" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/10">
            <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Coming Soon
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            {featureName}
            <span className="text-indigo-600 dark:text-indigo-400"> đang được hoàn thiện</span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto transition-colors duration-300">
            {description || defaultDescription}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          {/* Primary Button - Notify Me */}
          <button className="group relative px-8 py-3 bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30 dark:hover:shadow-indigo-400/20 hover:bg-indigo-700 dark:hover:bg-indigo-500/60 overflow-hidden">
            {/* Shimmer effect on button */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white dark:via-slate-200 to-transparent animate-pulse" />

            <div className="relative flex items-center gap-2 justify-center">
              <Bell className="w-5 h-5" />
              <span>Nhận thông báo khi ra mắt</span>
            </div>
          </button>

          {/* Secondary Link - Back to Home */}
          <Link
            href="/projects"
            className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-all duration-300 hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-900/50"
          >
            Quay lại Trang chủ
          </Link>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-slate-500 dark:text-slate-400 pt-4 transition-colors duration-300"
        >
          Cảm ơn vì sự kiên nhẫn. Chúng tôi sẽ sớm công bố những tính năng mới!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;
