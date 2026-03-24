import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext } from "react";
import { AuthModal } from "./AuthModal";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function WorkflowStream() {
  const stages = [
    { label: "Backlog", color: "#94A3B8", count: 12 },
    { label: "In Progress", color: "#6366F1", count: 7 },
    { label: "Review", color: "#8B5CF6", count: 4 },
    { label: "Blocked", color: "#EC4899", count: 2 },
    { label: "Done", color: "#10B981", count: 18 },
  ];

  const tasks = [
    { id: 1, title: "API integration", stage: 1, priority: "high" },
    { id: 2, title: "Design review", stage: 2, priority: "med" },
    { id: 3, title: "Data pipeline", stage: 1, priority: "high" },
    { id: 4, title: "User testing", stage: 3, priority: "low" },
    { id: 5, title: "Launch prep", stage: 0, priority: "high" },
    { id: 6, title: "Analytics setup", stage: 4, priority: "med" },
  ];

  const priorityColor = {
    high: "#EC4899",
    med: "#6366F1",
    low: "#10B981",
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 p-5 overflow-hidden">
      {/* Column headers */}
      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        {stages.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="w-full rounded-lg px-2 py-1.5 text-center mb-2"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
              <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Task cards */}
      <div className="relative flex-1 overflow-hidden">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="absolute rounded-xl p-3 shadow-sm"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              width: "calc(20% - 8px)",
              left: `calc(${task.stage * 20}% + 4px)`,
              top: `${(i % 3) * 38}px`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: priorityColor[task.priority] }} />
              <span className="text-xs font-medium truncate" style={{ color: "var(--text-main)" }}>
                {task.title}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-100">
              <div className="h-1 rounded-full"
                style={{
                  width: `${[30, 65, 80, 45, 100][task.stage]}%`,
                  background: stages[task.stage].color,
                }} />
            </div>
          </motion.div>
        ))}

        {/* Bottleneck indicator */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="absolute rounded-xl px-3 py-2 redzone"
          style={{
            background: "rgba(236,72,153,0.12)",
            border: "1px solid rgba(236,72,153,0.4)",
            left: "calc(60% + 4px)",
            bottom: "8px",
            width: "calc(20% - 8px)",
          }}
        >
          <span className="text-xs font-bold" style={{ color: "#EC4899" }}>⚠ Bottleneck</span>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--move-border)" }}>
        <div className="flex gap-4">
          {[
            { l: "Process Score", v: "87%", c: "#6366F1" },
            { l: "Avg Cycle", v: "3.2d", c: "var(--text-main)" },
          ].map(m => (
            <div key={m.l}>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{m.l}</div>
              <div className="text-sm font-bold" style={{ color: m.c }}>{m.v}</div>
            </div>
          ))}
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
          ML Active
        </span>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] },
  }),
};

export function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [quickSignup, setQuickSignup] = useState({
    isOpen: false,
    mode: "signup",
    initialEmail: "",
    initialStep: 1,
  });
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const quickStartEmail = (rawEmail) => {
    const trimmed = rawEmail.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return trimmed;
  };

  const handleGetStarted = () => {
    const validated = quickStartEmail(email);
    if (!validated) return;

    setQuickSignup({
      isOpen: true,
      mode: "signup",
      initialEmail: validated,
      initialStep: 2,
    });
    setSubmitted(true);
  };

  return (
    <section
      id="platform"
      className="py-28 bg-white dark:bg-slate-950 transition-all duration-500"
    >
      {/* Decorative circles */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1 lg:max-w-[52%]">
            {/* Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: "var(--badge-bg)", color: "var(--badge-text)", border: "1px solid var(--surface-border)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--badge-text)" }} />
              Process Intelligence Platform — v2.0
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="font-display font-black leading-tight mb-6 tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", color: "var(--text-main)" }}>
              One Platform to<br />
              Monitor{" "}
              <span className="gradient-text">Everything.</span>
              <br />
              Any Process,<br />Any Scale.
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--text-secondary)" }}>
              From supply chain logistics to creative workflows.
              TASKA uses{" "}
              <span className="font-semibold" style={{ color: "#6366F1" }}>ML-driven analysis</span>
              {" "}to find bottlenecks before they cost you time.
            </motion.p>

            {/* Email CTA */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" id="hero-cta">
              <AnimatePresence mode="wait">
                {isAuthenticated && user ? (
                  <motion.div
                    key="authenticated-cta"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 max-w-lg"
                  >
                    <button
                      onClick={() => navigate("/profile")}
                      className="btn-indigo px-7 py-4 rounded-xl text-sm whitespace-nowrap"
                    >
                      Go to Dashboard
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unauthenticated-cta"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5 }}
                  >
                    {submitted ? (
                      <div className="rounded-2xl px-6 py-5 flex items-center gap-4 max-w-lg"
                        style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
                        <span className="text-2xl">🎉</span>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: "var(--badge-text)" }}>You're in!</div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            We'll reach out to {email} within 24 hours.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form
                        className="flex flex-col sm:flex-row gap-3 max-w-lg"
                        onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
                      >
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Enter your work email"
                          className="flex-1 px-5 py-4 rounded-xl text-sm font-medium"
                          style={{
                            border: emailError ? "1px solid #EF4444" : "1px solid var(--surface-border)",
                            outline: "none",
                            background: "var(--panel-bg)",
                            color: "var(--text-main)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.16)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleGetStarted}
                          className="btn-indigo px-7 py-4 rounded-xl text-sm whitespace-nowrap"
                        >
                          Get Started Free
                        </button>
                      </form>
                    )}
                    {emailError && (
                      <p className="text-sm mt-2" style={{ color: "#EF4444" }}>
                        {emailError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {!isAuthenticated && (
                <p className="text-xs mt-3" style={{ color: "var(--info-text)" }}>
                  No credit card required · 14-day trial · Cancel anytime
                </p>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-6 mt-12 pt-8"
              style={{ borderTop: "1px solid var(--surface-border)" }}>
              <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Trusted by teams at</div>
              {['Stripe', 'Notion', 'Figma', 'Vercel', 'Linear'].map(brand => (
                <span key={brand} className="text-sm font-bold" style={{ color: "var(--info-text)" }}>{brand}</span>
              ))}
            </motion.div>
          </div>

          {/* Right: Workflow dashboard */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-shrink-0 w-full lg:w-[46%]"
          >
            <div
              className="rounded-3xl overflow-hidden float-anim"
              style={{
                background: "var(--panel-bg)",
                border: "1px solid var(--panel-border)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.16)",
                height: 460,
              }}
            >
              {/* Window chrome */}
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--move-border)", background: "var(--surface-alt)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FCA5A5" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FCD34D" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#6EE7B7" }} />
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "var(--badge-text)" }} />
                  TASKA — Workflow Monitor
                </div>
                <div className="text-xs px-2 py-1 rounded-md" style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
                  Live
                </div>
              </div>
              <WorkflowStream />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={quickSignup.isOpen}
        onClose={() => setQuickSignup((prev) => ({ ...prev, isOpen: false }))}
        mode={quickSignup.mode}
        initialEmail={quickSignup.initialEmail}
        initialStep={quickSignup.initialStep}
      />
    </section>
  );
}
