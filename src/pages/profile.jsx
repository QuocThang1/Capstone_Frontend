import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateProfileApi } from "../utils/Api/accountApi";
import { toast } from "react-toastify";
import { AuthContext } from "../context/auth.context";
import ButtonSpinner from "../components/ButtonSpinner";

const ProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { user, setAuth } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            username: "",
            fullName: "",
            email: "",
            phone: "",
            dob: "",
            gender: "",
        },
    });

    // Populate form with user data on component mount
    useEffect(() => {
        if (user) {
            // Format date for input type="date"
            const formattedDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : "";

            reset({
                username: user.username || "",
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                dob: formattedDob,
                gender: user.gender || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const res = await updateProfileApi(data);

            if (res.EC === 0) {
                toast.success(res.EM || "Profile updated successfully!");

                // Update auth context with new data
                setAuth({
                    isAuthenticated: true,
                    user: {
                        ...user,
                        username: data.username,
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phone,
                        dob: data.dob,
                        gender: data.gender,
                    },
                });

                setIsEditing(false);
            } else {
                toast.error(res.EM || "Update failed");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error?.response?.data?.EM || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to user data
        const formattedDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : "";

        reset({
            username: user.username || "",
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            dob: formattedDob,
            gender: user.gender || "",
        });

        setIsEditing(false);
    };

    // Custom validation for phone
    const validatePhone = (value) => {
        if (!value) return "Phone number is required";

        const cleanValue = value.replace(/\s+/g, '');
        const vnFormat1 = /^0\d{9}$/;
        const vnFormat2 = /^\+84\d{9}$/;

        if (!vnFormat1.test(cleanValue) && !vnFormat2.test(cleanValue)) {
            return "Phone must start with 0 or +84 and have 10 digits";
        }

        return true;
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 mb-6 group cursor-pointer"
                >
                    <svg
                        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Back to Home</span>
                </button>
                {/* Header */}
                <div className="glass-card rounded-2xl p-8 mb-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                                {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{user?.fullName || "User Profile"}</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {user?.role === "admin" ? "Administrator" : "User"}
                                </p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Form */}
                <div className="glass-card rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Username <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message: "Username must be at least 3 characters"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: "Username can only contain letters, numbers and underscores"
                                    }
                                })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.username
                                    ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                    }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Full name must be at least 2 characters"
                                    }
                                })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.fullName
                                    ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && (
                                <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email and Phone */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Email <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.email
                                        ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                        : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                        }`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Phone <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register("phone", {
                                        validate: validatePhone
                                    })}
                                    disabled={!isEditing}
                                    maxLength={13}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.phone
                                        ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                        : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                        }`}
                                    placeholder="0987654321"
                                />
                                {errors.phone && (
                                    <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Date of Birth and Gender */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="dob" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Date of Birth <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    {...register("dob", {
                                        required: "Date of birth is required"
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.dob
                                        ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                        : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                        }`}
                                />
                                {errors.dob && (
                                    <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.dob.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Gender <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    {...register("gender", {
                                        required: "Please select your gender"
                                    })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.gender
                                        ? "border-rose-500 dark:border-rose-400 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                                        : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${!isEditing ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed" : ""
                                        }`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.gender.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading ? (
                                        <ButtonSpinner text="Saving..." />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 py-3 rounded-lg font-bold text-lg hover:bg-slate-400 dark:hover:bg-slate-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;