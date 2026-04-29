import React from 'react';

const ButtonSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white dark:border-slate-100 border-t-transparent dark:border-t-transparent rounded-full animate-spin transition-colors"></div>
      <span className="text-white dark:text-slate-100">{text}</span>
    </div>
  );
};

export default ButtonSpinner;