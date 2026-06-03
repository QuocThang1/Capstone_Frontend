import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseOutlined, MenuOutlined, MoonOutlined, SunOutlined, LogoutOutlined } from "@ant-design/icons";
import { Drawer, Dropdown } from "antd";
import { AuthModal } from "./AuthModal";
import { useTheme } from "../../context/theme.context";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, mode: "signup" });
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLogin) {
      setModalState({ isOpen: true, mode: "login" });
      navigate(location.pathname, { replace: true, state: { ...location.state, openLogin: false } });
    }
  }, [location.state, navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: {
        _id: "",
        email: "",
        fullName: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        role: "",
      },
    });
    Object.keys(localStorage).forEach((key) => {
      // Quét tìm tất cả các key bắt đầu bằng "pinned_nav_" và xóa chúng
      if (key.startsWith('pinned_nav_')) {
        localStorage.removeItem(key);
      }
    });
    setDropdownOpen(false);
    navigate("/");
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => {
        navigate("/profile");
        setDropdownOpen(false);
      },
    },
    {
      key: "admin",
      label: "Admin",
      onClick: () => {
        navigate("/admin");
        setDropdownOpen(false);
      },
    },
    {
      key: "projects",
      label: "Projects",
      onClick: () => {
        navigate("/projects");
        setDropdownOpen(false);
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  const navLinks = [
    { label: "Platform", id: "platform" },
    { label: "Industries", id: "industries" },
    { label: "Features", id: "features" },
    { label: "Resources", id: "footer" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div
          className="nav-glass w-full rounded-2xl px-6 flex items-center justify-between"
          style={{
            maxWidth: 1200,
            height: 64,
            boxShadow: scrolled ? "0 8px 32px rgba(15,23,42,0.08)" : "0 2px 12px rgba(15,23,42,0.04)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              <span className="font-display font-black text-white text-sm">T</span>
            </div>
            <span className="font-display font-black text-xl text-[#0F172A] dark:text-white">
              TASKA
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-slate-50"
                style={{ color: "#475569" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#6366F1")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isAuthenticated && user ? (
                <Dropdown
                  menu={{ items: profileMenuItems }}
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <motion.button
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <div
                      className="w-10 h-10 rounded-full ring-1 ring-slate-20x0 dark:ring-slate-600 flex items-center justify-center font-semibold text-sm"
                      style={{ background: "#7C3AED", color: "white" }}
                    >
                      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.fullName || "User"}
                    </span>
                  </motion.button>
                </Dropdown>
              ) : (
                <motion.div
                  key="auth-buttons"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <button
                    className="text-sm font-semibold px-4 py-2 transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6366F1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                    onClick={() => setModalState({ isOpen: true, mode: "login" })}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => setModalState({ isOpen: true, mode: "signup" })}
                    className="btn-indigo text-sm px-5 py-2.5 rounded-lg"
                  >
                    Get Started
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              className="text-sm font-semibold px-4 py-2 transition-colors text-slate-600 hover:text-indigo-500"
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: theme === "dark" ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setDrawerOpen(true)}
            style={{ color: "#475569" }}
          >
            <MenuOutlined style={{ fontSize: 20 }} />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        style={{ width: 280 }}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: "24px 16px" } }}
        title={
          <span className="font-display font-black text-lg" style={{ color: "#0F172A" }}>
            TASKA
          </span>
        }
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.id)}
              className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "#475569" }}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #E2E8F0" }}>
            {isAuthenticated && user ? (
              <button
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-left"
                style={{ color: "#6366F1", background: "#E0E7FF" }}
                onClick={() => { navigate("/profile"); setDrawerOpen(false); }}
              >
                {user.fullName || "Profile"}
              </button>
            ) : (
              <button
                className="w-full btn-indigo py-3 rounded-xl text-sm"
                onClick={() => { setModalState({ isOpen: true, mode: "signup" }); setDrawerOpen(false); }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </Drawer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: modalState.mode })}
        mode={modalState.mode}
      />
    </>
  );
};
