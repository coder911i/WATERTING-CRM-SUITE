import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = "",
  onClick,
  hoverable = false,
}) => {
  const baseClasses = `
    bg-neutral-0 dark:bg-neutral-800 
    border border-neutral-200 dark:border-neutral-700 
    rounded-lg p-5 md:p-6 
    shadow-sm 
    transition-all duration-200
  `;

  const interactionClasses = onClick || hoverable
    ? "cursor-pointer hover:shadow-md hover:transform hover:-translate-y-0.5 active:translate-y-0"
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactionClasses} ${className}`}
    >
      {title && (
        <div className="border-bottom border-neutral-200 dark:border-neutral-700 mb-4 pb-3">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 letter-tight">
            {title}
          </h3>
        </div>
      )}
      <div className="text-neutral-700 dark:text-neutral-300 text-base">
        {children}
      </div>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    type: "up" | "down" | "neutral";
  };
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = "",
}) => {
  const trendColor = trend
    ? trend.type === "up"
      ? "text-success"
      : trend.type === "down"
      ? "text-error"
      : "text-neutral-500"
    : "";

  return (
    <div className={`bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 shadow-sm flex items-start gap-4 ${className}`}>
      {icon && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-lg text-primary-700 dark:text-primary-300 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          {value}
        </p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center font-medium ${trendColor}`}>
            {trend.type === "up" ? "↑" : trend.type === "down" ? "↓" : "→"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};
