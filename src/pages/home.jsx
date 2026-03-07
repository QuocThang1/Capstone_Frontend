const HomePage = () => {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-16 px-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#101A17] mb-6 leading-tight">
                    Maximize Efficiency.<br />
                    Detect Bottlenecks<br />
                    <span className="text-[#4ADE80]">Instantly.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Analyze system performance and detect bottlenecks instantly.
                    Optimize your workflow with advanced AI technology.
                </p>
                <button className="bg-[#101A17] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#4ADE80] hover:text-[#101A17] transition text-lg">
                    Get Started Free
                </button>
                {/* Mockup Image */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-96 rounded flex items-center justify-center">
                            <span className="text-gray-400">Dashboard Preview</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <h2 className="text-4xl font-bold text-center text-[#101A17] mb-4">
                    General Tools Leave Gaps.
                </h2>
                <p className="text-center text-gray-600 mb-12">We Bridge Them.</p>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold text-[#101A17] mb-3">Faster in Practice</h3>
                        <p className="text-gray-600">
                            Optimize real-world performance with in-depth analytics tools and
                            instant improvement suggestions.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-[#101A17] mb-3">Visually Adaptable</h3>
                        <p className="text-gray-600">
                            Intuitive interface, easily customizable to fit the needs of each
                            project and workflow.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
                        <div className="text-4xl mb-4">🔗</div>
                        <h3 className="text-xl font-bold text-[#101A17] mb-3">Easier Stack Integration</h3>
                        <p className="text-gray-600">
                            Seamlessly integrate with existing technologies in your tech stack
                            without complex configuration.
                        </p>
                    </div>
                </div>
            </section>

            {/* Unified Ecosystem Section */}
            <section className="bg-white py-16 px-4 rounded-lg">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-[#101A17] mb-6">
                            A Unified Ecosystem for<br />
                            Real-Time Control.
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Control your entire system from a single platform.
                            Monitor, analyze and optimize every process in real-time.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-[#4ADE80] text-2xl">✓</span>
                                <div>
                                    <h4 className="font-semibold text-[#101A17]">All-Stage Tier Programming</h4>
                                    <p className="text-gray-600 text-sm">Multi-tier programming for every development stage</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#4ADE80] text-2xl">✓</span>
                                <div>
                                    <h4 className="font-semibold text-[#101A17]">A Shared Security System</h4>
                                    <p className="text-gray-600 text-sm">Comprehensive security system for the entire application</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#4ADE80] text-2xl">✓</span>
                                <div>
                                    <h4 className="font-semibold text-[#101A17]">Integrated Alerts & Toolkits</h4>
                                    <p className="text-gray-600 text-sm">Smart alerts and pre-integrated toolkits</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#4ADE80] text-2xl">✓</span>
                                <div>
                                    <h4 className="font-semibold text-[#101A17]">No-Code Data Insight Panels</h4>
                                    <p className="text-gray-600 text-sm">Data analytics dashboard without coding required</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-[#101A17] to-[#1e3a32] p-8 rounded-lg shadow-xl">
                        <div className="bg-white/10 h-96 rounded flex items-center justify-center">
                            <span className="text-white/50">System Diagram</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-br from-[#0d1512] to-[#1a2e27] text-white py-16 px-4 rounded-lg">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Empowering Every Level of Your
                </h2>
                <h2 className="text-4xl font-bold text-center mb-12">
                    <span className="text-[#4ADE80]">Organization.</span>
                </h2>
                <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
                    <div>
                        <div className="text-5xl font-bold text-[#4ADE80] mb-2">98%</div>
                        <p className="text-gray-300">Bottleneck detection accuracy</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-[#4ADE80] mb-2">45%</div>
                        <p className="text-gray-300">Reduced average processing time</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-[#4ADE80] mb-2">24/7</div>
                        <p className="text-gray-300">Continuous system monitoring</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-[#4ADE80] mb-2">500+</div>
                        <p className="text-gray-300">Trusted enterprises</p>
                    </div>
                </div>
            </section>

            {/* Transform Section */}
            <section className="py-16">
                <h2 className="text-4xl font-bold text-center text-[#101A17] mb-12">
                    Transform Engagement into<br />
                    <span className="text-[#4ADE80]">Results.</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="text-2xl">📊</div>
                            <div>
                                <h4 className="font-semibold text-[#101A17]">Real-time Analysis</h4>
                                <p className="text-gray-600 text-sm">Monitor performance instantly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="text-2xl">🚀</div>
                            <div>
                                <h4 className="font-semibold text-[#101A17]">Auto Optimization</h4>
                                <p className="text-gray-600 text-sm">AI suggests performance improvements</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="text-2xl">🔔</div>
                            <div>
                                <h4 className="font-semibold text-[#101A17]">Smart Alerts</h4>
                                <p className="text-gray-600 text-sm">Get notified when issues are detected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="text-2xl">📈</div>
                            <div>
                                <h4 className="font-semibold text-[#101A17]">Detailed Reports</h4>
                                <p className="text-gray-600 text-sm">Export data and insights easily</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full rounded flex items-center justify-center">
                            <span className="text-gray-400">Analytics Preview</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#101A17] text-white py-16 px-4 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-6">
                    Ready to Uncover Your Workflow<br />
                    <span className="text-[#4ADE80]">Bottlenecks?</span>
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Start analyzing your system today. No credit card required,
                    free 14-day trial.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-6 py-3 rounded-lg w-80 text-[#101A17]"
                    />
                    <button className="bg-[#4ADE80] text-[#101A17] px-8 py-3 rounded-lg font-semibold hover:bg-[#22D3EE] transition">
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;