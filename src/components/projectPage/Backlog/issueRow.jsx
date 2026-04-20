import { CheckSquare } from 'lucide-react'; // Hoặc một icon khác bạn muốn

const IssueRow = ({ issue }) => {
    return (
        <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
            <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-slate-500">{issue.issueKey}</span>
                <span className="text-sm text-slate-800 dark:text-slate-200">{issue.title}</span>
            </div>
            <div className="flex items-center gap-3">
                {/* Avatar người được assign (tạm thời) */}
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                    ?
                </div>
            </div>
        </div>
    );
};

export default IssueRow;