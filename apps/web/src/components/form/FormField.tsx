import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  success?: boolean;
  hint?: string;
  rows?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  required = false,
  disabled = false,
  placeholder,
  value,
  onChange,
  error,
  success,
  hint,
  rows,
  maxLength,
  pattern,
  autoComplete,
}) => {
  const isTextarea = type === "textarea";
  const inputClasses = `
    w-full px-3 py-2 
    bg-white text-gray-900
    border border-gray-300 
    rounded-md
    text-sm font-normal
    placeholder-gray-400
    transition-all duration-200
    ${error ? "border-red-500 bg-red-50 text-gray-900" : ""}
    ${success ? "border-green-500 bg-green-50 text-gray-900" : ""}
    focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600
    disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  return (
    <div className="form-field mb-5 flex flex-col">
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows || 4}
          maxLength={maxLength}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          pattern={pattern}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        />
      )}

      {error && (
        <p id={`${name}-error`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <span>⚠️</span> {error}
        </p>
      )}

      {!error && success && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
          <span>✓</span> Looks good!
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
