"use client";

import React from "react";

export interface StatBadgeConfig {
  label: string;
  variant?: "default" | "brand" | "success" | "warning" | "danger" | string;
  trend?: "up" | "down";
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  period?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  badge?: string | StatBadgeConfig | React.ReactNode;
  variant?: "default" | "brand" | "outline" | "success" | "warning" | "danger";
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  period,
  subtitle,
  description,
  icon,
  iconBg = "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40",
  badge,
  variant = "default",
  onClick,
  className = "",
}: StatCardProps) {
  const isClickable = Boolean(onClick);
  const bottomText = subtitle || description || period;

  const variantStyles: Record<string, string> = {
    default:
      "border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 text-gray-900 dark:text-white",
    brand:
      "border border-brand-500 bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-500/15",
    outline:
      "border-2 border-dashed border-gray-200 bg-transparent dark:border-gray-800 text-gray-900 dark:text-white",
    success:
      "border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
    warning:
      "border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
    danger:
      "border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
  };

  const renderBadge = () => {
    if (!badge) return null;

    if (typeof badge === "string" || typeof badge === "number") {
      return (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            variant === "brand"
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {badge}
        </span>
      );
    }

    if (typeof badge === "object" && badge !== null && "label" in (badge as any)) {
      const config = badge as StatBadgeConfig;
      let badgeStyle = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      if (config.variant === "success") {
        badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300";
      } else if (config.variant === "warning") {
        badgeStyle = "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300";
      } else if (config.variant === "danger") {
        badgeStyle = "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300";
      } else if (config.variant === "brand") {
        badgeStyle = "bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300";
      }

      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            variant === "brand" ? "bg-white/20 text-white" : badgeStyle
          }`}
        >
          {config.trend === "up" && (
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {config.trend === "down" && (
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {config.label}
        </span>
      );
    }

    // Direct ReactNode
    return <>{badge}</>;
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 shadow-xs transition-all duration-200 ${
        variantStyles[variant]
      } ${
        isClickable
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          : "hover:shadow-md"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium ${
            variant === "brand"
              ? "text-brand-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {title}
        </span>

        <div className="flex items-center gap-2">
          {renderBadge()}

          {icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                variant === "brand"
                  ? "bg-white/15 text-white border border-white/20 backdrop-blur-sm"
                  : iconBg
              }`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold tracking-tight ${
            variant === "brand" ? "text-white" : "text-gray-900 dark:text-white"
          }`}
        >
          {value}
        </span>

        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              variant === "brand"
                ? "text-brand-100"
                : isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <svg className="h-3 w-3 fill-current" viewBox="0 0 12 12">
                <path d="M6 2.5l4 4.5H2z" />
              </svg>
            ) : (
              <svg className="h-3 w-3 fill-current" viewBox="0 0 12 12">
                <path d="M6 9.5L2 5h8z" />
              </svg>
            )}
            {change}
          </span>
        )}
      </div>

      {bottomText && (
        <p
          className={`mt-1 text-[11px] ${
            variant === "brand"
              ? "text-brand-200"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {bottomText}
        </p>
      )}
    </div>
  );
}
