import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  success?: boolean;
  hint?: string;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  required = false,
  disabled = false,
  value,
  onChange,
  error,
  success,
  hint,
  placeholder,
}) => {
  const selectClasses = `
    w-full px-3 py-2 pr-8
    bg-white text-gray-900
    border border-gray-300
    rounded-md
    text-sm font-normal
    transition-all duration-200
    cursor-pointer
    appearance-none
    ${error ? "border-red-500 bg-red-50 text-gray-900" : ""}
    ${success ? "border-green-500 bg-green-50 text-gray-900" : ""}
    focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600
    disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  // Inline style for background image to avoid CSS escape issues in JS strings
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px 12px',
    paddingRight: '32px'
  };

  return (
    <div className="form-field mb-5 flex flex-col">
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
        style={selectStyle}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
      >
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${name}-error`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <span>⚠️</span> {error}
        </p>
      )}

      {!error && success && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
          <span>✓</span> Selected
        </p>
      )}

      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1 text-xs text-gray-600">
          {hint}
        </p>
      )}
    </div>
  );
};
