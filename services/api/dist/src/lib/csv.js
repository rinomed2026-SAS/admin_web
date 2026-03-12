export function toCsv(rows) {
    if (rows.length === 0)
        return '';
    const headers = Object.keys(rows[0]);
    const escape = (value) => {
        if (value === null || value === undefined)
            return '';
        const text = String(value);
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    };
    const lines = [headers.join(',')];
    for (const row of rows) {
        lines.push(headers.map((key) => escape(row[key])).join(','));
    }
    return lines.join('\n');
}
