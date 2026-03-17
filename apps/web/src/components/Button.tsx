import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-5 py-2.5 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  };

  const variantClasses = {
    primary: "bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none",
    secondary: "bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-700 border border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400",
    outline: "bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-50 focus:ring-2 focus:ring-primary-700 disabled:border-neutral-200 disabled:text-neutral-400",
    danger: "bg-error hover:bg-red-600 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500 disabled:bg-neutral-200",
    ghost: "bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900",
  };

  const disabledClasses = disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-98";

  const renderIcon = () => {
    if (!icon) return null;
    return <span className={`flex items-center ${iconPosition === "left" ? "mr-2" : "ml-2"} text-current`}>{icon}</span>;
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};
