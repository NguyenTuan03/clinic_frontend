"use client";

import { Search } from "lucide-react";

interface SearchComponentProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchComponent({ value, onChange }: SearchComponentProps) {
    return (
        <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            <input
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
            />
        </div>
    );
}