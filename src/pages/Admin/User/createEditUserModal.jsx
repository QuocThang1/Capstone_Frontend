import { useForm } from "react-hook-form";
import ButtonSpinner from "../../../components/ButtonSpinner";

const CreateEditUserModal = ({ mode, user, onSubmit, onClose, loading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: user || {
            username: "",
            password: "",
            fullName: "",
            email: "",
            phone: "",
            dob: "",
            gender: "",
            role: "user",
            active: true,
        },
    });

    // Custom validation for phone
    const validatePhone = (value) => {
        if (!value) return "Phone number is required";

        const cleanValue = value.replace(/\s+/g, "");
        const vnFormat1 = /^0\d{9}$/;
        const vnFormat2 = /^\+84\d{9}$/;

        if (!vnFormat1.test(cleanValue) && !vnFormat2.test(cleanValue)) {
            return "Phone must start with 0 or +84 and have 10 digits";
        }

        return true;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 transition-all duration-300">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between transition-colors duration-300">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                        {mode === "create" ? "Create New User" : "Edit User"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: "Username can only contain letters, numbers and underscores",
                                    },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.username ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                    } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                placeholder="Enter username"
                            />
                            {errors.username && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Password {mode === "create" && <span className="text-rose-500">*</span>}
                                {mode === "edit" && <span className="text-slate-500 dark:text-slate-400 text-xs">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: mode === "create" ? "Password is required" : false,
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.password ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                    } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                placeholder="Enter password"
                            />
                            {errors.password && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Full Name & Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        minLength: { value: 2, message: "Full name must be at least 2 characters" },
                                    })}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.fullName ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.fullName.message}</p>}
                            </div>

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
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.email ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Phone & DOB */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Phone <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register("phone", { validate: validatePhone })}
                                    maxLength={13}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.phone ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                    placeholder="0987654321"
                                />
                                {errors.phone && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Date of Birth <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    {...register("dob", { required: "Date of birth is required" })}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.dob ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                />
                                {errors.dob && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.dob.message}</p>}
                            </div>
                        </div>

                        {/* Gender, Role & Status */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="gender" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Gender <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    {...register("gender", { required: "Please select gender" })}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.gender ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 cursor-pointer text-slate-900 dark:text-slate-100`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.gender.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Role <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    {...register("role", { required: "Please select role" })}
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 bg-white dark:bg-slate-900 ${errors.role ? "border-rose-500 dark:border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900/50" : "border-slate-300 dark:border-slate-600 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                                        } focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 cursor-pointer text-slate-900 dark:text-slate-100`}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{errors.role.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="active" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Status <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="active"
                                    {...register("active")}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 transition-all duration-200 bg-white dark:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 cursor-pointer text-slate-900 dark:text-slate-100"
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 py-3 rounded-lg font-bold hover:bg-indigo-700 dark:hover:bg-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                            >
                                {loading ? <ButtonSpinner text="Saving..." /> : mode === "create" ? "Create User" : "Update User"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 py-3 rounded-lg font-bold hover:bg-slate-400 dark:hover:bg-slate-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEditUserModal;