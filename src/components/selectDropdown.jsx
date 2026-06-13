import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const SelectDropdown = ({ value, options, onChange, placeholder, size = "md", width = "w-full", isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hiển thị text trên nút trigger
    let displayText = placeholder;
    if (isMulti) {
        if (Array.isArray(value) && value.length > 0) {
            const selectedLabels = options.filter(o => value.includes(o.value)).map(o => o.label);
            displayText = selectedLabels.length > 2 
                ? `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}` 
                : selectedLabels.join(', ');
        }
    } else {
        const selectedOption = options.find(o => o.value === value);
        if (selectedOption) displayText = selectedOption.label;
    }

    // Kích thước của trigger button (để tái sử dụng cho loại to nhỏ khác nhau)
    const paddingClass = size === "sm" ? "px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200" : "px-3 py-2 text-sm text-slate-700 dark:text-slate-200";

    const handleSelect = (optValue) => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(optValue)
                ? currentValues.filter(v => v !== optValue)
                : [...currentValues, optValue];
            onChange(newValues);
        } else {
            onChange(optValue);
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative ${width}`} ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${paddingClass}`}
            >
                <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{displayText}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 mt-1 min-w-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1.5 custom-scrollbar"
                    >
                        {options.map((opt) => {
                            const isSelected = isMulti 
                                ? (Array.isArray(value) && value.includes(opt.value))
                                : value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer rounded-md ${isSelected
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold dark:text-indigo-400"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <span>{opt.label}</span>
                                    {isMulti && (
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SelectDropdown;