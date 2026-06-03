import { useEffect, useState, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { respondToInvitationApi } from '../utils/Api/projectApi';
import Spinner from '../components/spinner';
import { ProjectContext } from '../context/project.context';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const { fetchAllProjects } = useContext(ProjectContext);

    // Khóa chống gọi lặp 2 lần do React StrictMode
    const hasRequested = useRef(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid invitation link");
            navigate('/');
            return;
        }

        // Nếu đã từng gọi thì chặn lại
        if (hasRequested.current) return;
        hasRequested.current = true;

        const acceptInvite = async () => {
            try {
                const res = await respondToInvitationApi(token);
                if (res && res.EC === 0) {
                    setStatus('success');
                    toast.success(res.EM || "Joined project successfully!");
                    // Refresh lại danh sách project trong context để UI tự động cập nhật
                    fetchAllProjects();
                    setTimeout(() => navigate('/projects'), 2000);
                } else {
                    setStatus('error');
                    toast.error(res.EM || "Invitation failed or expired.");
                }
            } catch (error) {
                setStatus('error');
                toast.error(error?.response?.data?.EM || "Error accepting invitation.");
            }
        };

        acceptInvite();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="p-8 max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl text-center border border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Project Invitation</h1>

                {status === 'processing' && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Spinner />
                        <p className="text-slate-600 dark:text-slate-300">Adding you to the project...</p>
                    </div>
                )}

                {status === 'success' && (
                    <p className="text-emerald-600 font-medium py-4">You have been added! Redirecting to your projects...</p>
                )}

                {status === 'error' && (
                    <div className="flex flex-col gap-4 py-4">
                        <p className="text-red-500 font-medium">The invitation link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;