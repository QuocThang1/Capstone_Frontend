import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getHistoryByIssueApi } from '../../../utils/Api/historyApi';
import Spinner from '../../spinner';
import HistoryItem from './historyItem';

const HistorySection = ({ issueId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!issueId) return;
            setLoading(true);
            try {
                const res = await getHistoryByIssueApi(issueId);
                if (res && res.EC === 0) {
                    // Sắp xếp lịch sử từ mới nhất đến cũ nhất
                    const sortedHistory = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setHistory(sortedHistory);
                } else {
                    toast.error(res.EM || "Failed to fetch history.");
                }
            } catch (error) {
                toast.error(error?.response?.data?.EM || "An error occurred while fetching history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [issueId]);

    if (loading) {
        return <div className='flex justify-center py-4'><Spinner /></div>;
    }

    return (
        <div className="space-y-1 divide-y divide-slate-200 dark:divide-slate-700">
            {history.length > 0 ? (
                history.map(entry => <HistoryItem key={entry._id} entry={entry} />)
            ) : (
                <p className="text-sm text-slate-500 text-center py-4">No activity history for this issue yet.</p>
            )}
        </div>
    );
};

export default HistorySection;