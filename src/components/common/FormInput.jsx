// File: src/components/common/FormInput.jsx
// Component input form thống nhất

import React from 'react';

const FormInput = ({ 
  label, 
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  suffix,
  variant = "default", // default, price, search
  className = "",
  inputClassName = "",
  ...props
}) => {
  const baseInputClass = "form-input w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 px-4 placeholder:text-slate-400 transition-all";
  
  const variantClasses = {
    default: "h-12",
    price: "h-12 bg-blue-50/50 dark:bg-blue-900/10 text-primary font-bold text-lg",
    search: "h-11 bg-white dark:bg-slate-800 shadow-sm"
  };

  const inputClass = `${baseInputClass} ${variantClasses[variant]} ${suffix ? 'pr-12' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''} ${inputClassName}`;

  return (
    <div className={`group ${className}`}>
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {suffix && (
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none ${variant === 'price' ? 'text-primary font-bold' : 'text-slate-400'}`}>
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export const FormTextarea = ({ 
  label, 
  required = false,
  placeholder,
  value,
  onChange,
  error,
  rows = 5,
  className = "",
  ...props
}) => {
  const textareaClass = `form-textarea w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 p-4 placeholder:text-slate-400 transition-all resize-y ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`;

  return (
    <div className={`group ${className}`}>
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export const FormSelect = ({ 
  label, 
  required = false,
  value,
  onChange,
  options = [],
  error,
  className = "",
  ...props
}) => {
  const selectClass = `form-select w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 h-12 pl-4 pr-10 appearance-none transition-all cursor-pointer ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`;

  return (
    <div className={`group ${className}`}>
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-semibold text-sm mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={selectClass}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
