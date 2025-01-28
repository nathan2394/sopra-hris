import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (dataTable, filename = 'data', template = 'default') => {
    let arrObj = dataTable;
    // if(template !== 'default'){
    //     arrObj = dataTable?.map((val) => (
    //         {
    //             "Acc. No.": val?.accountNo,
    //             "Trans. Amount" : Math.round(val?.netto),
    //             "emp.Number": val?.nik,
    //             "emp.Name": val?.name,
    //             "Dept": val?.divisionName,
    //             "Trans. Date": coverDate(val?.transDate)
    //         }
    //     ))
    // }
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(arrObj);

    if(template !== 'default'){
        Object.keys(worksheet).forEach((key) => {
            if (key.startsWith("F")) { // Assuming 'F' is the column for "Trans. Date"
                worksheet[key].z = "dd/mm/yy"; // Date format
            }
        });
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert workbook to binary data
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob and trigger file download
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${filename}.xlsx`);
}

export const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
};

export const coverDate = (val) => {
    if(val){
        const inputDate = val;
        const date = new Date(inputDate);
    
        const day = date.getDate().toString().padStart(2, "0");;
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear().toString().slice(-2);
        
        const formattedDate = `${day}-${month}-${year}`;
    
        return formattedDate;
    }
    return val;
}

export const getMonthName = (monthNumber) => {
    const months = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December"
    ];
    
    return months[monthNumber - 1];
}

export const formatHeader = (value) => {
    let readableFormat = value.replace(/([a-z])([A-Z])/g, '$1 $2');  // Add space before uppercase
    readableFormat = readableFormat.charAt(0).toUpperCase() + readableFormat.slice(1); // Capitalize the first letter

    return readableFormat;
}

export const formatText = (value) => {
    const checkText = typeof value;

    if (checkText === "number") {
        return Math?.round(value)?.toLocaleString('id-ID');
    } else if (checkText === "string" && !isNaN(value)) {
        // If it's a string and can be parsed as a number, treat it as a string
        return value;
    } else {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return coverDate(value);
        }
        return value;
    }
};


export const checkType = (value) => {
    const checkType = typeof value;
    return checkType;
}