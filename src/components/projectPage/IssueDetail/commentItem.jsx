import { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Edit, Trash2, CornerDownRight } from 'lucide-react';

const CommentItem = ({ comment, onAction, currentUserId, isReply }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isAuthor = comment.authorId._id === currentUserId;

    // Tự động đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUpdate = () => {
        if (editedContent.trim() === comment.content.trim() || !editedContent.trim()) {
            setIsEditing(false);
            return;
        }
        onAction('update', { ...comment, content: editedContent });
        setIsEditing(false);
    };

    const handleDelete = () => {
        onAction('delete', comment);
        setMenuOpen(false);
    };

    const handlePostReply = () => {
        if (!replyContent.trim()) return;
        onAction('reply', { parentId: comment._id, content: replyContent });
        setReplyContent('');
        setIsReplying(false);
    };

    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-sm text-slate-500">
                {comment.authorId?.fullName.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.authorId?.fullName || 'Anonymous'}</span>
                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        {comment.createdAt !== comment.updatedAt && <span className="text-xs text-slate-500">(edited)</span>}
                    </div>
                    <div className="relative" ref={menuRef}>
                        {!isReply && (
                            <button onClick={() => setIsReplying(prev => !prev)} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md cursor-pointer"><CornerDownRight className="w-4 h-4" /></button>
                        )}
                        {isAuthor && (
                            <button onClick={() => setMenuOpen(prev => !prev)} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md cursor-pointer"><MoreHorizontal className="w-4 h-4" /></button>
                        )}
                        {isMenuOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><Edit className="w-4 h-4" /> Edit</button>
                                    <button onClick={handleDelete} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {isEditing ? (
                    <div className="mt-1">
                        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows="2" className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800" />
                        <div className="mt-1 flex gap-2">
                            <button onClick={handleUpdate} className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">Save</button>
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-md whitespace-pre-wrap">{comment.content}</p>
                )}

                {/* Reply Input Box */}
                {isReplying && (
                    <div className="mt-2">
                        <textarea
                            placeholder={`Replying to ${comment.authorId?.fullName}...`}
                            className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                            rows="2"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            autoFocus
                        ></textarea>
                        <div className="mt-1 flex gap-2">
                            <button onClick={handlePostReply} className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">Post</button>
                            <button onClick={() => setIsReplying(false)} className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Replies Section */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-5 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                        {comment.replies.map(reply => (
                            <CommentItem key={reply._id} comment={reply} onAction={onAction} currentUserId={currentUserId} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;