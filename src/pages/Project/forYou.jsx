import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/context/auth.context";

import ProjectAdminView from "@/components/projectPage/forYou/ProjectAdminView";
import RecentProjectsSection from "@/components/projectPage/forYou/RecentProjectsSection";
import UserActivitySection from "@/components/projectPage/forYou/UserActivitySection";

const ForYou = () => {
  const { auth } = useContext(AuthContext);
  const user = auth?.user || {};

  return (
    <div className="space-y-8 pb-10 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {user.fullName || "User"}! 👋
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
          Here's what's happening across your projects today.
        </p>
      </motion.div>

      <ProjectAdminView />
      <RecentProjectsSection />
      
      {/* Extracted User Activity Tabs */}
      <UserActivitySection />
    </div>
  );
};

export default ForYou;
