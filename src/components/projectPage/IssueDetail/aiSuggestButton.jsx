import { Sparkles } from "lucide-react"

const AiSuggestButton = ({ onClick, isSuggesting }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isSuggesting}
        className="mt-1.5 w-full flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 px-3 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
        {isSuggesting ? (
            <>
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                <span>Analyzing Team Skills...</span>
            </>
        ) : (
            <>
                <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Get AI Suggestion</span>
            </>
        )}
    </button>
);

export default AiSuggestButton;