import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseOutlined, CheckCircleOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import { loginApi, signUpApi, sendOtpApi, verifyOtpApi } from "../utils/Api/accountApi";
import { toast } from "react-toastify";

// Success Step Component
const SuccessStep = ({ modalMode }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="text-center py-8"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      <CheckCircleOutlined
        className="text-6xl text-green-500 mb-4"
      />
    </motion.div>
    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-50">
      {modalMode === "signup" ? "Welcome to TASKA!" : "Welcome back!"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400">
      {modalMode === "signup"
        ? "Your account has been created successfully."
        : "You've been logged in successfully."
      }
    </p>
  </motion.div>
);

// Signup Steps Component
const SignupSteps = ({ currentStep, formData, handleInputChange, errors, handleContinue, handleBack, setModalMode, resetModal, handleSocialAuth, isSubmitting }) => (
  <AnimatePresence mode="wait">
    {currentStep === 1 && (
      <motion.div
        key="step1"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
            Start Your Free Trial
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Join thousands of teams already using TASKA
          </p>
          {errors.general && (
            <p className="text-sm mt-2 text-red-500">
              {errors.general}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm mt-1 text-red-500">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
        >
          Continue
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-3">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialAuth("google")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-all hover:shadow-md"
          >
            <GoogleOutlined className="text-blue-500" />
            <span className="text-sm font-medium">
              Google
            </span>
          </button>
          <button
            onClick={() => handleSocialAuth("github")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-all hover:shadow-md"
          >
            <GithubOutlined className="text-gray-900 dark:text-gray-100" />
            <span className="text-sm font-medium">
              GitHub
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => {
              setModalMode("login");
              resetModal();
            }}
            className="font-semibold transition-colors text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Log in
          </button>
        </p>
      </motion.div>
    )}

    {currentStep === 2 && (
      <motion.div
        key="step2"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
            Verify Your Email
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            We've sent a 6-digit code to {formData.email}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Verification code
          </label>
          <input
            type="text"
            value={formData.otp}
            onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-center text-2xl font-mono tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="000000"
            maxLength={6}
          />
          {errors.otp && (
            <p className="text-sm mt-1 text-red-500">
              {errors.otp}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
          >
            Continue
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Didn't receive the code?{" "}
          <button className="font-semibold transition-colors text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            Resend
          </button>
        </p>
      </motion.div>
    )}

    {currentStep === 3 && (
      <motion.div
        key="step3"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
            Complete Your Profile
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Just a few more details to get started
          </p>
          {(errors.email || errors.general) && (
            <p className="text-sm mt-2 text-red-500">
              {errors.email || errors.general}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-sm mt-1 text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-sm mt-1 text-red-500">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Login Step Component
const LoginStep = ({ formData, handleInputChange, errors, handleLogin, isSubmitting, setModalMode, resetModal, handleSocialAuth }) => (
  <motion.div
    key="login"
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    className="space-y-6"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
        Welcome Back
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Sign in to your TASKA account
      </p>
      {errors.general && (
        <p className="text-sm mt-2 text-red-500">
          {errors.general}
        </p>
      )}
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-sm mt-1 text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-sm mt-1 text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
          />
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
            Remember me
          </span>
        </label>
        <button className="text-sm font-semibold transition-colors text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          Forgot password?
        </button>
      </div>
    </div>

    <button
      type="button"
      onClick={handleLogin}
      disabled={isSubmitting}
      className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
    >
      Sign In
    </button>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-3">
          Or continue with
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => handleSocialAuth("google")}
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-all hover:shadow-md"
      >
        <GoogleOutlined className="text-blue-500" />
        <span className="text-sm font-medium">
          Google
        </span>
      </button>
      <button
        onClick={() => handleSocialAuth("github")}
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-all hover:shadow-md"
      >
        <GithubOutlined className="text-gray-900 dark:text-gray-100" />
        <span className="text-sm font-medium">
          GitHub
        </span>
      </button>
    </div>

    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
      Don't have an account?{" "}
      <button
        onClick={() => {
          setModalMode("signup");
          resetModal();
        }}
        className="font-semibold transition-colors text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Sign up
      </button>
    </p>
  </motion.div>
);

export function AuthModal({ isOpen, onClose, mode = "signup", initialEmail = "", initialStep = 1 }) {
  const [modalMode, setModalMode] = useState(mode); // "signup" or "login"
  const [currentStep, setCurrentStep] = useState(initialStep); // 1: email, 2: otp, 3: profile
  const [formData, setFormData] = useState({
    email: initialEmail || "",
    otp: "",
    fullName: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const { setAuth } = useContext(AuthContext);

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (currentStep === 1) {
      if (!validateEmail(formData.email)) {
        setErrors({ email: "Invalid email address" });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const res = await sendOtpApi(formData.email);

        if (res.EC === 0) {
          toast.success(res.EM || "OTP sent to your email.");
          setCurrentStep(2);
        } else {
          const message = res.EM || "Failed to send OTP";
          setErrors({ general: message });
        }
      } catch (error) {
        console.error("sendOtp error:", error);
        const msg = error?.response?.data?.EM || "Failed to send OTP, please retry.";
        setErrors({ general: msg });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (currentStep === 2) {
      if (formData.otp.length !== 6) {
        setErrors({ otp: "Please enter a 6-digit code" });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const res = await verifyOtpApi(formData.email, formData.otp);

        if (res.EC === 0) {
          toast.success(res.EM || "OTP verified.");
          setCurrentStep(3);
        } else {
          const message = res.EM || "OTP invalid or expired.";
          setErrors({ otp: message });
        }
      } catch (error) {
        console.error("verifyOtp error:", error);
        const msg = error?.response?.data?.EM || "OTP verification failed.";
        setErrors({ otp: msg });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (currentStep === 3) {
      if (!formData.fullName || !validatePassword(formData.password)) {
        setErrors({
          fullName: !formData.fullName ? "Full name is required" : "",
          password: !validatePassword(formData.password) ? "Password must be at least 8 characters" : "",
        });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const payload = {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
        };

        const res = await signUpApi(payload);

        if (res.EC === 0) {
          const account = res.data || {};
          if (res.access_token) {
            localStorage.setItem("access_token", res.access_token);
          }
          setAuth({
            isAuthenticated: true,
            user: {
              _id: account._id || "",
              email: account.email || formData.email,
              fullName: account.fullName || formData.fullName,
              username: account.username || "",
              dob: account.dob || "",
              gender: account.gender || "",
              phone: account.phone || "",
              role: account.role || "user",
            },
          });

          toast.success(res.EM || "Account created successfully!");

          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            resetModal();
          }, 1200);
        } else {
          const errorMessage = res.EM || "Registration failed";
          // During signup step 3, show email conflicts as general error
          if (errorMessage.toLowerCase().includes("email")) {
            setErrors({ general: errorMessage });
          } else {
            setErrors({ general: errorMessage });
          }
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Signup error:", error);
        const errorMessage = error?.response?.data?.EM || "An error occurred during signup";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      setErrors({
        email: !validateEmail(formData.email) ? "Invalid email address" : "",
        password: !validatePassword(formData.password) ? "Password must be at least 8 characters" : "",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await loginApi(formData.email, formData.password);

      if (res.EC === 0) {
        const account = res.data || {};
        if (res.access_token) {
          localStorage.setItem("access_token", res.access_token);
        }
        setAuth({
          isAuthenticated: true,
          user: {
            _id: account._id || "",
            email: account.email || formData.email,
            fullName: account.fullName || "",
            username: account.username || "",
            dob: account.dob || "",
            gender: account.gender || "",
            phone: account.phone || "",
            role: account.role || "user",
          },
        });

        toast.success(res.EM || "Login successful!");
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          resetModal();
        }, 1200);
      } else {
        const errorMessage = res.EM || "Login failed";
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.response?.data?.EM || "Invalid username or password";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = (step = 1, email = "") => {
    setCurrentStep(step);
    setFormData({
      email: email ?? "",
      otp: "",
      fullName: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
    setIsSuccess(false);
  };

  // Keep modal mode in sync with the parent mode prop and reset when opening.
  useEffect(() => {
    if (isOpen) {
      setModalMode(mode);
      const desiredStep = initialStep === 2 ? 2 : 1;
      const desiredEmail = initialEmail || formData.email || "";
      resetModal(desiredStep, desiredEmail);
      setIsSubmitting(false);
    }
    // We intentionally omit formData from deps to avoid full reinitialization while open.
  }, [isOpen, mode, initialStep, initialEmail]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSocialAuth = (provider) => {
    console.log(`Authenticating with ${provider}`);
    // Handle social authentication here
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="glass-card rounded-2xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <CloseOutlined />
              </button>

              {/* Modal content based on mode and success state */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <SuccessStep key="success" modalMode={modalMode} />
                ) : modalMode === "signup" ? (
                  <SignupSteps
                    key="signup"
                    currentStep={currentStep}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    handleContinue={handleContinue}
                    handleBack={handleBack}
                    setModalMode={setModalMode}
                    resetModal={resetModal}
                    handleSocialAuth={handleSocialAuth}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <LoginStep
                    key="login"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    handleLogin={handleLogin}
                    isSubmitting={isSubmitting}
                    setModalMode={setModalMode}
                    resetModal={resetModal}
                    handleSocialAuth={handleSocialAuth}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}