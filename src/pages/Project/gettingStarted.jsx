import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  GitBranch,
  Activity,
  Zap,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  LayoutDashboard
} from "lucide-react";

const GettingStarted = () => {
  const navigate = useNavigate();
  const docsRef = useRef(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const features = [
    {
      icon: Bot,
      title: "AI Smart Project Generation",
      description: "Type a single prompt to generate a complete project including board columns, workflows, sprints, and initial issues.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: GitBranch,
      title: "Custom Process Flows",
      description: "Design strict transition rules between statuses to ensure your team follows the correct agile processes.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Activity,
      title: "Bottleneck Detection",
      description: "AI automatically scans your active sprints to identify stuck issues and overloaded team members.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Automation Rules",
      description: "Set up triggers and actions to automate repetitive tasks, saving time and reducing manual errors.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: ShieldCheck,
      title: "Team Health & Workload",
      description: "Monitor real-time velocity, task distribution, and team wellbeing to prevent burnout.",
      color: "from-purple-500 to-fuchsia-500"
    },
    {
      icon: LayoutDashboard,
      title: "Interactive Boards",
      description: "Drag and drop issues across customizable columns with real-time updates and deep insights.",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="space-y-10"
        >
          {/* Header Section */}
          <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 shadow-xl">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-30" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Welcome to TASKA Workspace</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Manage projects smarter, <br className="hidden sm:block" />
                not harder.
              </h1>
              <p className="text-lg text-indigo-100/80 leading-relaxed mb-8 max-w-2xl">
                TASKA is a next-generation agile project management platform powered by AI. 
                Whether you're starting from scratch or migrating an existing team, this guide will help you unlock our most powerful features.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/projects/management")}
                  className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 cursor-pointer"
                >
                  Create First Project
                </button>
                <button 
                  onClick={() => docsRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 py-3 rounded-xl bg-indigo-800/50 text-white border border-indigo-500/30 font-semibold hover:bg-indigo-800 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  View Documentation
                </button>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Core Capabilities</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Discover what makes TASKA unique</p>
              </div>
            </motion.div>

            <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={item}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg text-white`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Quick Start Guide */}
          <motion.div variants={item} className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How to get started</h2>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Generate a Project", desc: "Click the '+' icon in the sidebar and describe your project to the AI. It will draft everything for you." },
                  { step: "02", title: "Invite your Team", desc: "Go to your project's members page to invite colleagues via email or copy an invite link." },
                  { step: "03", title: "Set up Workflows", desc: "Navigate to the Process Flow tab to configure your custom statuses and allowed transitions." },
                  { step: "04", title: "Start Sprints", desc: "Create your first sprint from the Backlog, assign story points, and hit Start!" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                        {item.step}
                      </div>
                      {idx !== 3 && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2" />}
                    </div>
                    <div className="pt-2 pb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Detailed Documentation */}
          <motion.div ref={docsRef} variants={item} className="space-y-8 mt-12 pb-12">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Documentation</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into terminology and best practices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Structure */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                  Project Structure
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Projects</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">The top-level container for your team's work. It holds all sprints, issues, and specific automation settings.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sprints</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">A fixed timebox (usually 1-4 weeks) during which specific issues are completed. Sprints must not overlap, and the active sprint must be chronologically the earliest.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Issues</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Individual tasks, bugs, or stories that need to be worked on. They transition through custom statuses based on your Process Flow.</p>
                  </div>
                </div>
              </div>

              {/* Story Points & Estimation */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Story Points & Estimation
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Story Points (SP) represent the effort required to complete an issue. They help gauge your team's capacity and velocity.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Standard Conversion:</span> 1 Story Point ≈ 4 Hours of work.
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Buffer Time:</span> Always set the issue's duration slightly longer than the exact hour calculation (e.g., if a task is 2 SP / 8 hours, allocate 1.5 - 2 days) to account for unexpected delays, context switching, and reviews.
                  </p>
                </div>
              </div>

              {/* AI-Powered Workspace */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  AI-Powered Workspace
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Smart Project Generation</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      Instead of manually setting up boards and tasks, you can simply type a requirement prompt. The AI will instantly generate a comprehensive project structure, including optimized sprint timelines, initial issues, and custom process flows.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Intelligent Assignee Suggestions</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      Stop guessing who should do what. Our AI engine analyzes the required skills for a specific issue and cross-references them with your team members' profiles to suggest the most qualified person for the task.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottlenecks & Deadlines */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Bottlenecks & Automated Scanning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">How it Works</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      The AI Bottleneck Detector analyzes the active sprint, checking for issues that are stuck in a status for too long, assignments causing extreme workload, or deadlines that are at risk.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Scheduled Scanning</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      Administrators can set up Automation rules to automatically scan issues nearing deadlines or flag bottlenecks at regular intervals (e.g., daily at 8 AM). Notifications will be sent via system alerts or emails to the relevant assignees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sprint & Workflow Rules */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  Sprint & Workflow Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Active Sprint Constraints
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 pl-3.5">
                      You can only change the status of an issue if it belongs to the currently <strong>Active Sprint</strong>. Issues in completed sprints are locked and can only be modified by the Project Leader.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Subtask & Documentation Requirements
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 pl-3.5">
                      Before marking an issue as <strong>Done</strong>, all of its subtasks must be completed. Additionally, a document/file attachment must be submitted to verify the completion.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Sprint Carry-over
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 pl-3.5">
                      When a sprint officially ends, any incomplete issues are automatically moved back to the <strong>Backlog</strong>. They can then be re-planned and assigned to future sprints.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GettingStarted;
