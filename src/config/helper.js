import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToXML = (dataTable, filename = 'data') => {
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataTable);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert workbook to binary data
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob and trigger file download
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${filename}.xlsx`);
}
