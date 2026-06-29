// Helper để chuẩn hóa định dạng thời gian về dạng HH:MM để so sánh
export const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    if (timeStr.includes("T")) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
            const pad = (n: number) => n.toString().padStart(2, "0");
            return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
        }
    }
    return timeStr;
};

// Helper để parse giờ/phút an toàn hỗ trợ cả định dạng ISO của Rails và HH:MM cũ
export const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 0, minutes: 0 };
    if (timeStr.includes("T")) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
            // Rails lưu múi giờ UTC, trích xuất giờ UTC tương ứng
            return {
                hours: d.getUTCHours(),
                minutes: d.getUTCMinutes()
            };
        }
    }
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
        return {
            hours: parseInt(parts[0], 10),
            minutes: parseInt(parts[1], 10)
        };
    }
    return { hours: 0, minutes: 0 };
};