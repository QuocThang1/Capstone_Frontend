import { useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ChevronDown } from 'lucide-react';
import { AuthContext } from '../../../context/auth.context';
import { getCommentsByIssueApi, createCommentApi, updateCommentApi, deleteCommentApi } from '../../../utils/Api/commentApi';
import Spinner from '../../spinner';
import socket from '../../../utils/socket';
import CommentItem from './commentItem';

const CommentSection = ({ issueId }) => {
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
    const [isSortMenuOpen, setSortMenuOpen] = useState(false);

    // Socket.io and initial fetch effect
    useEffect(() => {
        if (!issueId) return;

        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await getCommentsByIssueApi(issueId);
                if (res && res.EC === 0) {
                    setComments(res.data);
                } else {
                    toast.error(res.EM || "Failed to fetch comments.");
                }
            } catch (error) {
                toast.error(error?.response?.data?.EM || "Failed to fetch comments.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();

        socket.emit('join_issue_room', issueId);

        const handleNewComment = (comment) => {
            // Sắp xếp lại comment và replies theo thời gian tạo
            const sortReplies = (c) => ({ ...c, replies: c.replies?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) });

            if (comment.parentId) {
                setComments(prev => prev.map(c => c._id === comment.parentId ? sortReplies({ ...c, replies: [...(c.replies || []), comment] }) : c));
            } else {
                setComments(prev => [comment, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        };

        const handleUpdateComment = (updatedComment) => {
            setComments(prev => prev.map(c => {
                if (c._id === updatedComment._id) return { ...c, ...updatedComment };
                if (c.replies) {
                    return { ...c, replies: c.replies.map(r => r._id === updatedComment._id ? { ...r, ...updatedComment } : r) };
                }
                return c;
            }));
        };

        const handleDeleteComment = ({ _id, parentId }) => {
            if (parentId) {
                setComments(prev => prev.map(c => c._id === parentId ? { ...c, replies: c.replies.filter(r => r._id !== _id) } : c));
            } else {
                setComments(prev => prev.filter(c => c._id !== _id));
            }
        };

        socket.on('new_comment', handleNewComment);
        socket.on('update_comment', handleUpdateComment);
        socket.on('delete_comment', handleDeleteComment);

        return () => {
            socket.emit('leave_issue_room', issueId);
            socket.off('new_comment', handleNewComment);
            socket.off('update_comment', handleUpdateComment);
            socket.off('delete_comment', handleDeleteComment);
        };
    }, [issueId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        setActionLoading(true);
        try {
            const commentData = { issueId, content: newComment, parentId: null };
            await createCommentApi(commentData);
            setNewComment('');
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to post comment.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCommentAction = async (action, data) => {
        try {
            if (action === 'update') {
                const res = await updateCommentApi(data._id, data.content);
                toast.success(res.EM || "Comment updated!");
            } else if (action === 'delete') {
                const res = await deleteCommentApi(data._id);
                toast.success(res.EM || "Comment deleted!");
            } else if (action === 'reply') {
                const commentData = {
                    issueId,
                    content: data.content,
                    parentId: data.parentId
                };
                const res = await createCommentApi(commentData);
                toast.success(res.EM || "Reply posted!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || `Failed to ${action} comment.`);
        }
    };

    const sortedComments = useMemo(() => {
        const sorted = [...comments].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });

        return sorted.map(comment => ({
            ...comment
        }));

    }, [comments, sortOrder]);

    return (
        <div>
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex-shrink-0 flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-indigo-300">
                    {auth.user?.fullName?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="w-full">
                    <textarea
                        placeholder="Add a comment..."
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    {newComment && (
                        <div className='mt-2 flex items-center gap-2'>
                            <button onClick={handlePostComment} disabled={actionLoading} className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 cursor-pointer disabled:cursor-not-allowed">
                                {actionLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => setNewComment('')} className="px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <div className="relative inline-block text-left">
                    <div>
                        <button type="button" onClick={() => setSortMenuOpen(!isSortMenuOpen)} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            {sortOrder === 'latest' ? 'Latest' : 'Oldest'}
                            <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </button>
                    </div>
                    {isSortMenuOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                            <div className="py-1" role="none">
                                <a href="#" onClick={(e) => { e.preventDefault(); setSortOrder('latest'); setSortMenuOpen(false); }} className={`block px-4 py-2 text-sm cursor-pointer ${sortOrder === 'latest' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'}`} role="menuitem" id="menu-item-0">Latest</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setSortOrder('oldest'); setSortMenuOpen(false); }} className={`block px-4 py-2 text-sm cursor-pointer ${sortOrder === 'oldest' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'}`} role="menuitem" id="menu-item-1">Oldest</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="mt-6 space-y-4">
                {loading ? (
                    <div className='flex justify-center'><Spinner /></div>
                ) : (
                    sortedComments.map(comment => <CommentItem key={comment._id} comment={comment} onAction={handleCommentAction} currentUserId={auth.user._id} isReply={false} />)
                )}
            </div>
        </div>
    );
};

export default CommentSection;