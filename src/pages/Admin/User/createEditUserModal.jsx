import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import ButtonSpinner from "../../../components/ButtonSpinner";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateEditUserModal = ({ mode, user, onSubmit, onClose, loading }) => {
    const defaultVals = {
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        role: "user",
        active: "true",
    };

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: user
            ? {
                  ...user,
                  dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
                  active: String(user.active),
              }
            : defaultVals,
    });

    useEffect(() => {
        if (user) {
            reset({
                ...user,
                dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
                active: String(user.active),
            });
        } else {
            reset(defaultVals);
        }
    }, [user, reset]);

    const datePickerRef = useRef(null);

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

    const customSelectStyles = (hasError = false) => ({
        control: (base, state) => ({
            ...base,
            borderRadius: "12px",
            padding: "2px",
            borderColor: state.isFocused ? "#8B5CF6" : hasError ? "#f87171" : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(139,92,246,0.3)"
                : "0 2px 6px rgba(0,0,0,0.1)",
            "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#c0a8f9ff" : "white",
            color: state.isFocused ? "white" : "black",
            cursor: "pointer",
        }),
    });

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
    ];

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const statusOptions = [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-500">
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
                                className={`w-full px-4 py-2 rounded-xl 
                                    border border-gray-300
                                    bg-white
                                    shadow-sm
                                    transition-all duration-200
                                    hover:shadow-md
                                    focus:shadow-lg
                                    ${errors.username ? "border-red-500" : "focus:border-purple-500"}
                                    focus:ring-2 focus:ring-purple-400/30
                                    focus:ring-offset-0
                                    focus:outline-none`}
                                // className={`w-full px-4 py-2 rounded-lg border-[0.5px] ${
                                //     errors.username ? "border-red-500" : "border-gray-300"
                                //     } focus:border-[#8B5CF6] focus:outline-none focus:ring-0`}
                                // className={`w-full px-4 py-2 rounded-lg border ${errors.username ? "border-red-500" : "border-gray-300"
                                //     } focus:border-[#8B5CF6] focus:outline-none border-[0.5px] focus:ring-1 focus:ring-[#8B5CF6] focus:ring-opacity-20`}
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
                                className={`w-full px-4 py-2 rounded-xl 
                                    border border-gray-300
                                    bg-white
                                    shadow-sm
                                    transition-all duration-200
                                    hover:shadow-md
                                    focus:shadow-lg
                                    ${errors.password ? "border-red-500" : "focus:border-purple-500"}
                                    focus:ring-2 focus:ring-purple-400/30
                                    focus:ring-offset-0
                                    focus:outline-none`}
                                // className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                                //     } focus:border-[#8B5CF6] focus:outline-none border-[0.5px] focus:ring-2 focus:ring-[#8B5CF6] focus:ring-opacity-20`}
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
                                    className={`w-full px-4 py-2 rounded-xl 
                                        border border-gray-300
                                        bg-white
                                        shadow-sm
                                        transition-all duration-200
                                        hover:shadow-md
                                        focus:shadow-lg
                                        ${errors.fullName ? "border-red-500" : "focus:border-purple-500"}
                                        focus:ring-2 focus:ring-purple-400/30
                                        focus:ring-offset-0
                                        focus:outline-none`}
                                    // className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"
                                    //     } focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-opacity-20`}
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
                                    className={`w-full px-4 py-2 rounded-xl 
                                        border border-gray-300
                                        bg-white
                                        shadow-sm
                                        transition-all duration-200
                                        hover:shadow-md
                                        focus:shadow-lg
                                        ${errors.email ? "border-red-500" : "focus:border-purple-500"}
                                        focus:ring-2 focus:ring-purple-400/30
                                        focus:ring-offset-0
                                        focus:outline-none`}
                                    // className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                    //     } focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-opacity-20`}
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
                                    className={`w-full px-4 py-2 rounded-xl 
                                        border border-gray-300
                                        bg-white
                                        shadow-sm
                                        transition-all duration-200
                                        hover:shadow-md
                                        focus:shadow-lg
                                        ${errors.phone ? "border-red-500" : "focus:border-purple-500"}
                                        focus:ring-2 focus:ring-purple-400/30
                                        focus:ring-offset-0
                                        focus:outline-none`}
                                    // className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                                    //     } focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-opacity-20`}
                                    placeholder="0987654321"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{ required: "Date of birth is required" }}
                                    render={({ field }) => (
                                        <div className="relative w-full">
                                            <DatePicker
                                                ref={datePickerRef}
                                                selected={field.value ? new Date(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select date"
                                                maxDate={new Date()}
                                                className={`w-full px-4 py-2 pr-10 rounded-xl 
                                                border border-gray-300
                                                bg-white
                                                shadow-sm
                                                transition-all duration-200
                                                hover:shadow-md
                                                focus:shadow-lg
                                                ${errors.dob ? "border-red-500" : "focus:border-purple-500"}
                                                focus:ring-2 focus:ring-purple-400/30
                                                focus:ring-offset-0
                                                focus:outline-none`}
                                            />

                                            {/* ICON */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (datePickerRef.current && typeof datePickerRef.current.setOpen === "function") {
                                                        datePickerRef.current.setOpen(true);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (datePickerRef.current && typeof datePickerRef.current.setOpen === "function") {
                                                            datePickerRef.current.setOpen(true);
                                                        }
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            >
                                                📅
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                            </div>
                        </div>

                        {/* Gender, Role & Status */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>

                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: "Please select gender" }}
                                    render={({ field }) => (
                                        <Select
                                            styles={customSelectStyles(!!errors.gender)}
                                            options={genderOptions}
                                            placeholder="Select gender"
                                            value={genderOptions.find(o => o.value === field.value) || null}
                                            onChange={(selected) => field.onChange(selected?.value || "")}
                                            menuPortalTarget={document.body}
                                        />
                                    )}
                                />

                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>

                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: "Please select role" }}
                                    render={({ field }) => (
                                        <Select
                                            styles={customSelectStyles(!!errors.role)}
                                            options={roleOptions}
                                            placeholder="Select role"
                                            value={roleOptions.find(o => o.value === String(field.value)) || null}
                                            onChange={(selected) => field.onChange(selected?.value || "")}
                                            menuPortalTarget={document.body}
                                        />
                                    )}
                                />

                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#101A17] mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>

                                <Controller
                                    name="active"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            styles={customSelectStyles(false)}
                                            options={statusOptions}
                                            placeholder="Select status"
                                            value={statusOptions.find(o => String(o.value) === String(field.value)) || null}
                                            onChange={(selected) => field.onChange(String(selected?.value))}
                                            menuPortalTarget={document.body}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 
                                    bg-gradient-to-r from-purple-400 to-purple-800
                                    text-[#fcf0ff] py-3 rounded-lg font-bold
                                    hover:from-purple-600 hover:to-purple-900
                                    hover:scale-[1.02] active:scale-[0.98]
                                    transition-all duration-300
                                    disabled:from-gray-400 disabled:to-gray-400
                                    disabled:cursor-not-allowed
                                    shadow-lg cursor-pointer"
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