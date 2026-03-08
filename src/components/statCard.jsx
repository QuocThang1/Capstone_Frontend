const StatCard = ({ title, value, icon, iconColor, borderColor }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-[#101A17] mt-2">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${iconColor} bg-opacity-10 rounded-full flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StatCard;