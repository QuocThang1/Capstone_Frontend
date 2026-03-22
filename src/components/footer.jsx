import { GithubOutlined, TwitterOutlined, LinkedinOutlined, YoutubeOutlined, SlackOutlined } from "@ant-design/icons";

const links = {
  Platform: ["Overview", "Features", "Integrations", "API Reference", "Changelog", "Status"],
  Industries: ["Marketing Teams", "Engineering", "Operations", "HR & People", "Finance", "Healthcare"],
  Features: ["Event Logging", "Process Health Score", "Smart Alerts", "Visual Aggregation", "ML Engine", "RBAC & Audit Logs"],
  Resources: ["Documentation", "Blog", "Community", "Webinars", "Case Studies", "Templates"],
  Company: ["About", "Careers", "Press Kit", "Partners", "Security", "Privacy Policy"],
};

const securityBadges = [
  { icon: "🔐", label: "SOC 2 Type II" },
  { icon: "🛡️", label: "RBAC Controls" },
  { icon: "📋", label: "Full Audit Logs" },
  { icon: "🔒", label: "End-to-end Encrypted" },
  { icon: "🌍", label: "GDPR Compliant" },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-slate-950 text-white">
      {/* Security strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold tracking-widest uppercase text-white/40">
            Security & Compliance
          </span>
          <div className="flex flex-wrap gap-4">
            {securityBadges.map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs font-semibold text-white/50">
                <span>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                <span className="font-display font-black text-white text-sm">T</span>
              </div>
              <span className="font-display font-black text-xl text-white">TASKA</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              Universal Process Intelligence. Monitor everything. Optimize anything.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: <GithubOutlined />, label: "GitHub" },
                { icon: <TwitterOutlined />, label: "Twitter" },
                { icon: <LinkedinOutlined />, label: "LinkedIn" },
                { icon: <YoutubeOutlined />, label: "YouTube" },
                { icon: <SlackOutlined />, label: "Slack" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all bg-white/5 text-white/50 hover:bg-indigo-500/20 hover:text-indigo-200"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-5 text-indigo-300">
                {section}
              </h4>
              <ul className="space-y-3">
                {items.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors text-white/50 hover:text-white/80">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10">
        <p className="text-xs text-white/30">
          © 2026 TASKA, Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-xs text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </span>
          {["Privacy Policy", "Terms of Service", "Cookies"].map(t => (
            <a key={t} href="#" className="text-xs text-white/30 hover:text-white/70">
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
