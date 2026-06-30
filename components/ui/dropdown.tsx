"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  icon,
  emptyMessage,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  // Tính toán vị trí panel dựa trên trigger button
  const updatePanelPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        panelRef.current && !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cập nhật vị trí khi scroll hoặc resize
  useEffect(() => {
    if (!open) return;
    const handler = () => updatePanelPosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open) {
      updatePanelPosition();
    }
    setOpen(prev => !prev);
  };

  if (options.length === 0) {
    return (
      <div className={`px-4 py-3 text-sm text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 ${className}`}>
        {emptyMessage ?? "Không có lựa chọn khả dụng"}
      </div>
    );
  }

  const panel = open ? (
    <div
      ref={panelRef}
      style={panelStyle}
      className="
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-700/60
        rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-zinc-950/60
        overflow-hidden
      "
    >
      <ul className="py-1.5 max-h-52 overflow-y-auto">
        {options.map(opt => {
          const isSelected = opt.value === value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`
                  w-full flex items-start gap-3 px-4 py-2.5
                  text-sm text-left transition-colors duration-100 cursor-pointer
                  ${isSelected
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }
                `}
              >
                <span className="flex-1">
                  <span className="block font-medium">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-normal">
                      {opt.sublabel}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`
          w-full flex items-center gap-3 px-4 py-3
          bg-white dark:bg-zinc-900
          border rounded-2xl
          text-sm font-medium text-left
          transition-all duration-150 cursor-pointer
          ${open
            ? "border-emerald-500 ring-2 ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
            : "border-zinc-200 dark:border-zinc-700/60 hover:border-emerald-400 dark:hover:border-emerald-500/40 text-zinc-900 dark:text-zinc-100"
          }
        `}
      >
        {icon && (
          <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">
          {selected ? (
            <span className="flex flex-col">
              <span>{selected.label}</span>
              {selected.sublabel && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">
                  {selected.sublabel}
                </span>
              )}
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`shrink-0 w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel rendered via portal to escape overflow:hidden containers */}
      {typeof document !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
