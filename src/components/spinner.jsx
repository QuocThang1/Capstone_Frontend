const Spinner = ({
    size = "default", // "small" | "default" | "large"
    text = "",
    fullScreen = false,
    className = ""
}) => {
    // Size mappings
    const sizeClasses = {
        small: "h-6 w-6",
        default: "h-10 w-10",
        large: "h-16 w-16"
    };

    const spinnerSize = sizeClasses[size] || sizeClasses.default;

    const spinnerElement = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinner SVG */}
            <svg
                className={`animate-spin text-indigo-600 ${spinnerSize}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>

            {/* Loading Text */}
            {text && (
                <p className="text-gray-600 font-medium text-center animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    // Full screen spinner
    if (fullScreen) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${className}`}>
                {spinnerElement}
            </div>
        );
    }

    // Regular spinner
    return (
        <div className={`flex items-center justify-center py-8 ${className}`}>
            {spinnerElement}
        </div>
    );
};

export default Spinner;