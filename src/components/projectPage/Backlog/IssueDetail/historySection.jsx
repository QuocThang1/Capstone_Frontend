import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import { getHistoryApi } from '../../../../../utils/Api/issueApi'; // Giả sử bạn có API này
import Spinner from '../../../spinner';

const HistoryItem = ({ entry }) => {
    // Tùy chỉnh cách hiển thị cho từng loại lịch sử
    return (
        <div className="text-sm text-slate-600 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-slate-700">
            <strong>{entry.user}</strong> {entry.action} on {new Date(entry.timestamp).toLocaleString()}
        </div>
    );
}

const HistorySection = ({ issueId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!issueId) return;
            setLoading(true);
            try {
                // const res = await getHistoryApi(issueId);
                // if (res && res.EC === 0) {
                //     setHistory(res.data);
                // }
                // --- Dữ liệu giả lập ---
                console.log("Fetching history for issue:", issueId);
                setHistory([
                    { _id: '1', user: 'Dinh To Quoc Thang', action: 'updated the description', timestamp: new Date() },
                    { _id: '2', user: 'Dinh To Quoc Thang', action: 'changed the status from "To Do" to "In Progress"', timestamp: new Date() },
                ]);
                // --- Kết thúc dữ liệu giả lập ---
            } catch (error) {
                toast.error(error.message || "Failed to fetch history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [issueId]);

    if (loading) {
        return <div className='flex justify-center'><Spinner /></div>;
    }

    return (
        <div className="space-y-2">
            {history.length > 0 ? (
                history.map(entry => <HistoryItem key={entry._id} entry={entry} />)
            ) : (
                <p className="text-sm text-slate-500">No history for this issue yet.</p>
            )}
        </div>
    );
};

export default HistorySection;