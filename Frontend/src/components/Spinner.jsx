import React from "react";

const Spinner = ({ size = "md", color = "indigo", className = "", label }) => {
  const sizes = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-8 w-8 border-[3px]",
    xl: "h-10 w-10 border-4",
  };

  const colors = {
    indigo: "border-indigo-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-500 border-t-transparent",
    blue: "border-blue-600 border-t-transparent",
    green: "border-green-600 border-t-transparent",
    red: "border-red-600 border-t-transparent",
  };

  return (
    <div
      role="status"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <div
        className={`
          ${sizes[size]}
          ${colors[color]}
          animate-spin
          rounded-full
          transition-all
          duration-300
        `}
      />

      {label && (
        <span className="text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
};

export default Spinner;
