import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { AuthModal } from "./AuthModal";

export const CTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="cta"
      className="py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
      }}
      ref={ref}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-black tracking-tight mb-5 text-white"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
            One Platform for<br />Every Process.
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
            Join 500+ teams who monitor, analyze, and resolve bottlenecks
            before they become problems.
          </p>

          {submitted ? (
            <div className="rounded-2xl px-8 py-7 mx-auto max-w-md"
              style={{
                background: "var(--panel-bg)",
                border: "1px solid var(--surface-border)",
                backdropFilter: "blur(12px)",
              }}>
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-display font-bold text-xl mb-2 text-white">Check your inbox!</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                We'll send your trial link to {email} within 24 hours.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8"
              onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your work email"
                className="flex-1 px-5 py-4 rounded-xl text-sm"
                style={{
                  background: "var(--panel-bg)",
                  border: `2px solid ${focused ? "var(--badge-bg)" : "transparent"}`,
                  color: "var(--text-main)",
                  outline: "none",
                  fontWeight: 500,
                  boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.2)" : "0 4px 20px rgba(0,0,0,0.2)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-7 py-4 rounded-xl text-sm font-bold whitespace-nowrap text-white"
                style={{ background: "#0F172A", transition: "transform 0.15s, box-shadow 0.2s" }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Start Free Trial →
              </button>
            </form>
          )}

          <div className="flex flex-wrap justify-center gap-6">
            {["14-day free trial", "No credit card", "Setup in 5 min", "Cancel anytime"].map(item => (
              <span key={item} className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.85)" }}>
                <CheckCircleFilled style={{ color: "rgba(255,255,255,0.92)", fontSize: 14 }} />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="signup"
      />
    </section>
  );
  };
