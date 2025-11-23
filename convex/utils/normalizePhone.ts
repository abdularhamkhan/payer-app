export function normalizePhone(raw: string) {
        // 03XX-XXXXXXX → 923XXXXXXXXX
        const cleaned = raw.replace(/[^0-9]/g, "");

        if (cleaned.startsWith("0"))
                return "92" + cleaned.slice(1);

        return cleaned;
}
