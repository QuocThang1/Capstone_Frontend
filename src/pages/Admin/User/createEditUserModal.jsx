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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#101A17]">
                        {mode === "create" ? "Create New User" : "Edit User"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: "Username can only contain letters, numbers and underscores",
                                    },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.username ? "border-red-500" : "border-gray-300"
                                    } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                placeholder="Enter username"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-[#101A17] mb-2">
                                Password {mode === "create" && <span className="text-red-500">*</span>}
                                {mode === "edit" && <span className="text-gray-500 text-xs">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: mode === "create" ? "Password is required" : false,
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                                    } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                placeholder="Enter password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Full Name & Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        minLength: { value: 2, message: "Full name must be at least 2 characters" },
                                    })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                            </div>

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
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Phone & DOB */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register("phone", { validate: validatePhone })}
                                    maxLength={13}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                    placeholder="0987654321"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    {...register("dob", { required: "Date of birth is required" })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20`}
                                />
                                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                            </div>
                        </div>

                        {/* Gender, Role & Status */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="gender" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    {...register("gender", { required: "Please select gender" })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.gender ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20 cursor-pointer`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    {...register("role", { required: "Please select role" })}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.role ? "border-red-500" : "border-gray-300"
                                        } focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20 cursor-pointer`}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="active" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="active"
                                    {...register("active")}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:ring-opacity-20 cursor-pointer"
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
                                className="flex-1 bg-[#4ADE80] text-[#101A17] py-3 rounded-lg font-bold hover:bg-[#22D3EE] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                            >
                                {loading ? <ButtonSpinner text="Saving..." /> : mode === "create" ? "Create User" : "Update User"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
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