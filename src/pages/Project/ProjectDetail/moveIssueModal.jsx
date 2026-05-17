import { useState, useEffect } from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SelectDropdown from '../../../components/selectDropdown';

const MoveIssuesModal = ({
    isOpen,
    onClose,
    itemToDelete,
    availableItems,
    onConfirm,
    type = "column"
}) => {
    const [targetItemName, setTargetItemName] = useState('');

    useEffect(() => {
        if (isOpen && availableItems?.length > 0) {
            setTargetItemName(availableItems[0].name);
        }
    }, [isOpen, availableItems]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!targetItemName) return;
        onConfirm(itemToDelete.name, targetItemName);
    };

    // Chuẩn bị options cho SelectDropdown
    const dropdownOptions = availableItems.map(item => ({
        value: item.name,
        label: item.name
    }));

    // Cấu hình text hiển thị dựa trên type truyền vào
    const config = {
        column: {
            title: `Move work from "${itemToDelete?.name}"`,
            description: `Select a new home for any work with the ${itemToDelete?.name} status.`,
            deleteLabel: "This status will be deleted:"
        },
        type: {
            title: `Move issues from "${itemToDelete?.name}"`,
            description: `Select a new type for any issues classified as ${itemToDelete?.name} before deleting it.`,
            deleteLabel: "Deleting Type:"
        }
    };

    const currentConfig = config[type] || config.column;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {currentConfig.title}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {currentConfig.description}
                            </p>

                            <div className="flex items-center justify-center gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg">
                                <div className="text-center w-40">
                                    <p className="text-xs text-slate-500 mb-2">{currentConfig.deleteLabel}</p>
                                    <div className="px-3 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg w-full truncate border border-transparent">
                                        {itemToDelete?.name}
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-slate-400 mt-5 shrink-0" />

                                <div className="text-center w-40">
                                    <p className="text-xs text-slate-500 mb-2 text-center">Convert items to:</p>
                                    <SelectDropdown
                                        value={targetItemName}
                                        options={dropdownOptions}
                                        onChange={setTargetItemName}
                                        placeholder="Select target..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                            <button
                                type="button" onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button" onClick={handleConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                Delete & Reassign
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MoveIssuesModal;