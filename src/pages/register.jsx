import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpApi } from "../utils/Api/accountApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            username: "",
            fullName: "",
            email: "",
            phone: "",
            dob: "",
            gender: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...dataToSend } = data;

            const res = await signUpApi(dataToSend);

            if (res.EC === 0) {
                toast.success(res.EM || "Account created successfully!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(res.EM || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error?.response?.data?.EM || "An error occurred. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Custom validation for age
    const validateAge = (value) => {
        if (!value) return "Date of birth is required";

        const dobDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();

        if (age < 13) return "You must be at least 13 years old";
        if (age > 120) return "Please enter a valid date of birth";

        return true;
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F6F8F7]">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#101A17] mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us to start optimizing your workflow</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-[#101A17] mb-2">
                            Username <span className="text-red-500">*</span>
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
                            className={`w-full px-4 py-3 rounded-lg border ${errors.username
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-[#101A17] mb-2">
                            Full Name <span className="text-red-500">*</span>
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
                            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email and Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#101A17] mb-2">
                                Email <span className="text-red-500">*</span>
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
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-[#101A17] mb-2">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                {...register("phone", {
                                    validate: validatePhone
                                })}
                                maxLength={13}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                                placeholder="0987654321"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dob" className="block text-sm font-semibold text-[#101A17] mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="dob"
                                {...register("dob", {
                                    validate: validateAge
                                })}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.dob
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                            />
                            {errors.dob && (
                                <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-semibold text-[#101A17] mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                {...register("gender", {
                                    required: "Please select your gender"
                                })}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.gender
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 bg-white cursor-pointer`}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-[#101A17] mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    },
                                    pattern: {
                                        value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: "Password must contain uppercase, lowercase and number"
                                    }
                                })}
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#4ADE80] transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#101A17] mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords do not match"
                                })}
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.confirmPassword
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-[#4ADE80] focus:ring-[#4ADE80]"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#4ADE80] transition-colors duration-200"
                            >
                                {showConfirmPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4ADE80] text-[#101A17] py-3 rounded-lg font-bold text-lg hover:bg-[#22D3EE] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#101A17]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    {/* Sign In Link */}
                    <div className="text-center pt-2">
                        <span className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-[#4ADE80] font-semibold hover:text-[#22D3EE] hover:underline transition-all duration-300 cursor-pointer"
                            >
                                Sign In
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;