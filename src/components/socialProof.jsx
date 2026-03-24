import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials = [
    {
      quote: "TASKA identified a 6-hour approval bottleneck in our campaign pipeline we didn't even know existed. Fixed it and shipped 2 weeks early.",
      name: "Alicia Kwon",
      title: "VP Marketing",
      company: "Luminary Digital",
      initials: "AK",
      color: "#EC4899",
    },
    {
      quote: "We monitor 14 engineering teams across 3 timezones. TASKA's process health score gives our leads a single north star every morning.",
      name: "Dmitri Sokolov",
      title: "Engineering Director",
      company: "NorthGrid Systems",
      initials: "DS",
      color: "#6366F1",
    },
    {
      quote: "Procurement used to be a black box. Now we track every handoff in the supply chain and our on-time delivery went from 78% to 97%.",
      name: "Priya Narayanan",
      title: "COO",
      company: "OmniOps Corp",
      initials: "PN",
      color: "#F59E0B",
    },
  ];

  return (
    <section className="py-28 bg-white dark:bg-slate-950 transition-all duration-500" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>
            Teams that Run on TASKA
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">Across marketing, engineering, operations, and HR.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="bento-card rounded-3xl p-8 flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" fill="#6366F1" viewBox="0 0 16 16">
                    <path d="M8 1l1.854 3.754L14 5.528l-3 2.922.708 4.13L8 10.5l-3.708 2.08L5 8.45 2 5.528l4.146-.774z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-base leading-relaxed flex-1 mb-6 text-slate-700 dark:text-slate-200 italic">
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{t.name}</div>
                  <div className="text-xs text-indigo-500 dark:text-indigo-300">{t.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
