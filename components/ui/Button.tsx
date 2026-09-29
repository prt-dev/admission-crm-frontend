"use client";

import React from "react";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  href,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
    sm: "px-3 py-1.5 text-xs font-medium gap-1.5 rounded-xl",
    md: "px-4 py-2 text-xs sm:text-sm font-semibold gap-2 rounded-xl",
    lg: "px-5 py-2.5 text-sm sm:text-base font-semibold gap-2.5 rounded-xl",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500/50 shadow-brand-500/20",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
    outline:
      "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
    danger:
      "bg-rose-500 text-white shadow-sm hover:bg-rose-600 active:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500/50 shadow-rose-500/20",
    success:
      "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/50 shadow-emerald-500/20",
  };

  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const widthStyle = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`.trim();

  const loadingSpinner = (
    <svg
      className="animate-spin h-4 w-4 shrink-0 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (href && !disabled && !isLoading) {
    return (
      <Link href={href} className={combinedClasses}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {isLoading ? (
        <>
          {loadingSpinner}
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
