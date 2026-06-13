import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { sendOtpApi, changePasswordApi } from "../../utils/Api/accountApi";
import { AuthContext } from "../../context/auth.context";
import { toast } from "react-toastify";

// Success Step Component
const SuccessStep = () => (
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
      Password Changed Successfully!
    </h3>
    <p className="text-slate-500 dark:text-slate-400">
      Your password has been updated. Please log in again with your new password.
    </p>
  </motion.div>
);

// Step Components
const OldPasswordStep = ({ formData, handleInputChange, errors, handleContinue, isSubmitting }) => (
  <motion.div
    key="oldPassword"
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="space-y-6"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
        Change Your Password
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Enter your current password to continue
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
          Current Password
        </label>
        <input
          type="password"
          value={formData.oldPassword}
          onChange={(e) => handleInputChange("oldPassword", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your current password"
        />
        {errors.oldPassword && (
          <p className="text-sm mt-1 text-red-500">
            {errors.oldPassword}
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
      {isSubmitting ? "Verifying..." : "Continue"}
    </button>
  </motion.div>
);

const OTPStep = ({ formData, handleInputChange, errors, handleContinue, handleBack, isSubmitting }) => (
  <motion.div
    key="otp"
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="space-y-6"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
        Verify Your Email
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        We've sent a 6-digit code to your email
      </p>
    </div>

    <div className="space-y-4">
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
        disabled={isSubmitting}
        className="flex-1 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
      >
        {isSubmitting ? "Verifying..." : "Continue"}
      </button>
    </div>
  </motion.div>
);

const NewPasswordStep = ({ formData, handleInputChange, errors, handleContinue, handleBack, isSubmitting }) => (
  <motion.div
    key="newPassword"
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="space-y-6"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">
        Create New Password
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Enter your new password below
      </p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          New Password
        </label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Create a new password"
        />
        {errors.newPassword && (
          <p className="text-sm mt-1 text-red-500">
            {errors.newPassword}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Confirm Password
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-sm mt-1 text-red-500">
            {errors.confirmPassword}
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
        disabled={isSubmitting}
        className="flex-1 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 dark:shadow-neon-glow"
      >
        {isSubmitting ? "Changing..." : "Change Password"}
      </button>
    </div>
  </motion.div>
);

export const ChangePasswordModal = ({ isOpen, onClose, isInsideOverlay = false }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: oldPassword, 2: otp, 3: newPassword
  const [formData, setFormData] = useState({
    oldPassword: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useContext(AuthContext);

  // Helper functions
  const validatePassword = (password) => password.length >= 8;

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (currentStep === 1) {
      if (!formData.oldPassword) {
        setErrors({ oldPassword: "Current password is required" });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const res = await sendOtpApi(auth.user.email, 'change_password');

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
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!validatePassword(formData.newPassword)) {
        setErrors({
          newPassword: "Password must be at least 8 characters",
        });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setErrors({
          confirmPassword: "Passwords do not match",
        });
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const res = await changePasswordApi(
          formData.oldPassword,
          formData.otp,
          formData.newPassword
        );

        if (res.EC === 0) {
          toast.success(res.EM || "Password changed successfully!");
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            resetModal();
          }, 1200);
        } else {
          const errorMessage = res.EM || "Password change failed";
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Change password error:", error);
        const errorMessage = error?.response?.data?.EM || "An error occurred";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setFormData({
      oldPassword: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setIsSuccess(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && !isInsideOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50"></h1>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <CloseOutlined className="text-slate-600 dark:text-slate-400 text-lg" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <SuccessStep key="success" />
              ) : currentStep === 1 ? (
                <OldPasswordStep
                  key="step1"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleContinue={handleContinue}
                  isSubmitting={isSubmitting}
                />
              ) : currentStep === 2 ? (
                <OTPStep
                  key="step2"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleContinue={handleContinue}
                  handleBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <NewPasswordStep
                  key="step3"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleContinue={handleContinue}
                  handleBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      
      {isOpen && isInsideOverlay && (
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50"></h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <CloseOutlined className="text-slate-600 dark:text-slate-400 text-lg" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessStep key="success" />
            ) : currentStep === 1 ? (
              <OldPasswordStep
                key="step1"
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                handleContinue={handleContinue}
                isSubmitting={isSubmitting}
              />
            ) : currentStep === 2 ? (
              <OTPStep
                key="step2"
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                handleContinue={handleContinue}
                handleBack={handleBack}
                isSubmitting={isSubmitting}
              />
            ) : (
              <NewPasswordStep
                key="step3"
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                handleContinue={handleContinue}
                handleBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
