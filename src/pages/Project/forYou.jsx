const ForYou = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-[#101A17] mb-4">For You</h1>
                <p className="text-gray-600">
                    Recommended content and personalized suggestions will appear here.
                </p>
            </div>

            {/* Example cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="w-full h-40 bg-gradient-to-br from-[#4ADE80] to-[#22D3EE] rounded-lg mb-4"></div>
                        <h3 className="text-lg font-semibold text-[#101A17] mb-2">
                            Recommendation {i}
                        </h3>
                        <p className="text-sm text-gray-600">
                            This is a sample recommendation card.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForYou;