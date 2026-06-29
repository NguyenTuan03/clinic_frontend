"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiagnosisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (notes: string) => void;
}

export default function DiagnosisModal({ isOpen, onClose, onSubmit }: DiagnosisModalProps) {
    const [notes, setNotes] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(notes);
        setNotes("");
    };

    const handleClose = () => {
        setNotes("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-lg">Ghi chú &amp; Chỉ định chẩn đoán</CardTitle>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                        Điền tóm tắt kết quả điều trị hoặc chỉ định y tế cho bệnh nhân sau khi khám xong.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Kết quả chẩn đoán / Ghi chú đơn thuốc
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ví dụ: Bệnh nhân viêm họng hạt. Kê đơn thuốc kháng sinh uống 5 ngày. Tránh nước lạnh..."
                            rows={4}
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm leading-relaxed"
                        />
                    </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={handleClose}>
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
                    >
                        Xác nhận hoàn thành
                    </Button>
                </div>
            </Card>
        </div>
    );
}
