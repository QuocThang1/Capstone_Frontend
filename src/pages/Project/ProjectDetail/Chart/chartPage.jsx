import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getBurndownChartApi, getIssueTypeChartApi, getWorkloadChartApi, getVelocityChartApi } from '../../../../utils/Api/chartApi';
import BurndownChart from './BurndownChart';
import IssueTypeChart from './IssueTypeChart';
import WorkloadChart from './WorkloadChart';
import VelocityChart from './VelocityChart';
import Spinner from '../../../../components/spinner';
import { Activity, Calendar, PieChart, BarChart2, Users, TrendingUp } from 'lucide-react';
import SelectDropdown from '../../../../components/selectDropdown';

const ChartPage = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [sprintId, setSprintId] = useState(null);
    const [allSprints, setAllSprints] = useState([]);
    const [chartType, setChartType] = useState('burndown'); // 'burndown' | 'issue-type'

    const fetchChartData = async (selectedSprintId = null, selectedType = 'burndown') => {
        setLoading(true);
        try {
            let apiCall = getBurndownChartApi;
            if (selectedType === 'issue-type') apiCall = getIssueTypeChartApi;
            else if (selectedType === 'workload') apiCall = getWorkloadChartApi;
            else if (selectedType === 'velocity') apiCall = getVelocityChartApi;

            const res = await apiCall(projectId, selectedSprintId);
            if (res && res.EC === 0) {
                if (res.data.noData) {
                    setChartData(null);
                } else {
                    setChartData(res.data);
                    if (res.data.allSprints) {
                        setAllSprints(res.data.allSprints.map(s => ({
                            value: s._id,
                            label: `${s.name} (${s.status})`
                        })));
                    }
                    if (!selectedSprintId && res.data.sprint) {
                        setSprintId(res.data.sprint.id);
                    }
                }
            } else {
                toast.error(res?.EM || "Failed to fetch chart data");
            }
        } catch (error) {
            toast.error(error.message || "Error fetching chart data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchChartData(sprintId, chartType);
        }
    }, [projectId, sprintId, chartType]);

    const handleSprintChange = (val) => {
        if (val !== sprintId) {
            setSprintId(val);
        }
    };

    const handleChartTypeChange = (type) => {
        if (type !== chartType) {
            setChartData(null);
            setChartType(type);
        }
    };

    return (
        <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Analytics</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Track sprint progress and team velocity
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        {/* Chart Type Selector */}
                        <div className="w-full sm:w-48">
                            <SelectDropdown
                                value={chartType}
                                options={[
                                    { value: 'burndown', label: 'Burndown Chart' },
                                    { value: 'issue-type', label: 'Issue Types Distribution' },
                                    { value: 'workload', label: 'Workload Balancing' },
                                    { value: 'velocity', label: 'Member Velocity' }
                                ]}
                                onChange={handleChartTypeChange}
                                placeholder="Select Chart Type"
                                disabled={loading}
                            />
                        </div>

                        {/* Sprint Filter */}
                        <div className="w-full sm:w-64">
                            <SelectDropdown
                                value={sprintId || ''}
                                options={allSprints}
                                onChange={handleSprintChange}
                                placeholder="Select a Sprint"
                                disabled={loading || allSprints.length === 0}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Chart Container */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
                >
                    {chartType === 'burndown' && (
                        <>
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <Activity className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Burndown Chart</h2>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[400px]">
                                        <Spinner />
                                    </div>
                                ) : !chartData || chartData.noData ? (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
                                        <Calendar className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No active or completed sprints found.</p>
                                    </div>
                                ) : (
                                    <BurndownChart
                                        labels={chartData.labels}
                                        idealData={chartData.datasets.ideal}
                                        actualData={chartData.datasets.actual}
                                        totalPoints={chartData.totalPoints}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {chartType === 'issue-type' && (
                        <>
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <PieChart className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Issue Type Distribution</h2>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[400px]">
                                        <Spinner />
                                    </div>
                                ) : (!chartData || chartData.noData || !chartData.issueTypeDistribution || chartData.issueTypeDistribution.labels.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
                                        <PieChart className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No issues found in this sprint.</p>
                                    </div>
                                ) : (
                                    <IssueTypeChart
                                        labels={chartData.issueTypeDistribution.labels}
                                        data={chartData.issueTypeDistribution.data}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {chartType === 'workload' && (
                        <>
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <Users className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Workload Balancing</h2>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[400px]">
                                        <Spinner />
                                    </div>
                                ) : (!chartData || chartData.noData || !chartData.workloadDistribution || chartData.workloadDistribution.labels.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
                                        <Users className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No member workloads found in this sprint.</p>
                                    </div>
                                ) : (
                                    <WorkloadChart
                                        labels={chartData.workloadDistribution.labels}
                                        datasets={chartData.workloadDistribution.datasets}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {chartType === 'velocity' && (
                        <>
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <TrendingUp className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Member Velocity</h2>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[400px]">
                                        <Spinner />
                                    </div>
                                ) : (!chartData || chartData.noData || !chartData.velocityDistribution || chartData.velocityDistribution.labels.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
                                        <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
                                        <p>No velocity data found in this sprint.</p>
                                    </div>
                                ) : (
                                    <VelocityChart
                                        labels={chartData.velocityDistribution.labels}
                                        datasets={chartData.velocityDistribution.datasets}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default ChartPage;
