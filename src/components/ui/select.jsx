import React from "react";

const Select = React.forwardRef(({ className = "", options = [], ...props }, ref) => {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:bg-gray-900 dark:text-gray-200 bg-white text-gray-900${className}`}
      ref={ref}
    
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";

export { Select }; 