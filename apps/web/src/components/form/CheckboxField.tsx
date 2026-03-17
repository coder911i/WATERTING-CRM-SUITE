import React from "react";

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked = false,
  disabled = false,
  onChange,
  error,
  hint,
}) => {
  const checkboxClasses = `
    h-4 w-4
    rounded
    border border-gray-300
    bg-white
    text-blue-600
    cursor-pointer
    transition-all duration-200
    focus:outline-none focus:ring-3 focus:ring-blue-100
    checked:border-blue-600 checked:bg-blue-600
    disabled:border-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  return (
    <div className="form-field mb-4">
      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={checkboxClasses}
          aria-invalid={!!error}
        />
        <label htmlFor={name} className="cursor-pointer text-sm font-normal text-gray-700 mb-0">
          {label}
        </label>
      </div>

      {error && (
        <p className="mt-1 ml-6 flex items-center gap-1 text-xs font-medium text-red-600">
          <span>⚠️</span> {error}
        </p>
      )}

      {hint && (
        <p className="mt-1 ml-6 text-xs text-gray-600">{hint}</p>
      )}
    </div>
  );
};
