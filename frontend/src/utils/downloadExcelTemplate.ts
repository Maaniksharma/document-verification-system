import * as XLSX from 'xlsx';

export function downloadExcelTemplate(headerFields: string[], filename = 'template.xlsx') {
    // Step 1: Create data with header + 5 empty rows
    const data = [
        headerFields,            // Header row
        [], [], [], [], []        // 5 empty rows
    ];

    // Step 2: Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Step 3: Write workbook and trigger download
    XLSX.writeFile(workbook, filename);
}