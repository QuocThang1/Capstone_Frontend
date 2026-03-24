import React from 'react';

const ButtonSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>{text}</span>
    </div>
  );
};

export default ButtonSpinner;