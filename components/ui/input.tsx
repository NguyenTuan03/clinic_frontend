import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({
  label,
  helperText,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border rounded-xl text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
          error
            ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
            : "border-zinc-200 dark:border-zinc-800"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-400 dark:text-zinc-600">{helperText}</p>
      ) : null}
    </div>
  );
}
