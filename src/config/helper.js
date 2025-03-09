import * as XLSX from "xlsx";
// import XlsxPopulate from "xlsx-populate";
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { saveAs } from "file-saver";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const useAuth = () => {
    return useContext(AuthContext);
};

export const months = [
    {label: "January", value: 1}, 
    {label: "February", value: 2}, 
    {label: "March", value: 3}, 
    {label: "April", value: 4}, 
    {label: "May", value: 5}, 
    {label: "June", value: 6}, 
    {label: "July", value: 7}, 
    {label: "August", value: 8}, 
    {label: "September", value: 9}, 
    {label: "October", value: 10}, 
    {label: "November", value: 11}, 
    {label: "December", value: 12}
];

export const years = [
    {label: "2025", value: 2025}
];

export const currYear = new Date().getFullYear();

export const currentMonth = new Date().getMonth() + 1;

export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Check if the date is valid
}

export const exportToExcel = (dataTable, filename = 'data', template = 'default') => {
    let arrObj = dataTable;

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(arrObj);

    if(template !== 'default'){
        Object.keys(worksheet).forEach((key) => {
            if (key.startsWith("F")) { // Assuming 'F' is the column for "Trans. Date"
                worksheet[key].z = "mm/dd/yyyy"; // Date format
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

export const generateExcel = (mainList, optionList, countColumn, countList, filename = 'data') => {
    const arr1 = mainList;
    const arr2 = optionList;
    
    // Step 1: Convert Data to Worksheets
    const ws1 = XLSX.utils.json_to_sheet(arr1);
    const ws2 = XLSX.utils.json_to_sheet(arr2);

    // Step 2: Create Workbook and Append Sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Sheet1");
    XLSX.utils.book_append_sheet(wb, ws2, "Sheet2");

    // Step 3: Write Workbook to Buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    XlsxPopulate.fromDataAsync(wbout).then(workbook => {
        const sheet1 = workbook.sheet("Sheet1");
        const sheet2 = workbook.sheet("Sheet2");

        // Define Dropdown List Source (Absolute Range)
        const dropdownRange = `Sheet2!$A$2:$A$${countList}`; // Absolute reference to column A in Sheet2

        arr1.forEach((_, rowIndex) => {
            for (let index = 0; index < countColumn; index++) {
                const colLetter = String.fromCharCode(68 + index); // 'D' = 68 (ASCII)
                sheet1.cell(`${colLetter}${rowIndex + 2}`).dataValidation({
                    type: "list",
                    showDropDown: true,
                    formula1: dropdownRange // Set dropdown list source
                });
            }
        });

        // Step 6: Export the Updated Excel File
        return workbook.outputAsync().then(data => {
            saveAs(new Blob([data]), `${filename}.xlsx`);
        });
    });
};

export const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
};

export const coverDate = (val, displayYear = 'default') => {
    if(val){
        const inputDate = val;
        const date = new Date(inputDate);
    
        if(displayYear !== 'default'){
            let day = date.getDate();
            let month = date.getMonth() + 1; // Months are zero based
            let year = date.getFullYear().toString(); // Get last two digits of year
          
            // Pad day and month with leading zeros if needed
            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;
          
            // Return formatted date
            return `${month}/${day}/${year}`;
        }else{            
            const day = date.getDate().toString().padStart(2, "0");;
            const month = date.toLocaleString("en-GB", { month: "short" });
            const year = displayYear !== 'default' ? date.getFullYear().toString().slice(-2) : date.getFullYear().toString();
            
            const formattedDate = `${day}-${month}-${year}`;
        
            return formattedDate;
        }
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
        // const date = new Date(value);
        // if (!isNaN(date.getTime())) {
        //     return coverDate(value);
        // }
        const datePatterns = [
            /^\d{2}\/\d{2}\/\d{4}$/, // dd/mm/yyyy or mm/dd/yyyy
            /^\d{4}-\d{2}-\d{2}$/,    // yyyy-mm-dd (ISO format)
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
        ];
    
        // Check if dateString matches any of the patterns
        const isValidFormat = datePatterns.some(pattern => pattern.test(value));
        if (isValidFormat){
            return coverDate(value);
        }
        
        return value;
    }
};

// export const formatNum = (value) => {
//     if(value){
//         let rawValue = value?.replace(/,/g, '');
//         console.log(rawValue)
//         const num = Number(rawValue);
//         return num.toLocaleString("id-ID");
//     }
//     // console.log(num, rawValue)
//     // if (typeof value === "number") {
//     //     //console.log(value,'test')
//     //     let rawValue = value;
//     //     if(value){
//     //         rawValue = value?.replace(/,/g, '');
//     //     }
//     //     return rawValue.toLocaleString("id-ID");
//     // } 
    
//     // if (typeof value === "string") {
//     //     console.log(value,'testing')
//     //     const num = Number(value);
//     //     if (!isNaN(num)) {
//     //         return num.toLocaleString("id-ID");
//     //     }
//     // }

//     return value;
// };

export const getQueryParam = (param) => {
    const hash = window.location.hash; // e.g. "#/employee?id=123"
    const queryString = hash.includes("?") ? hash.split("?")[1] : ""; // Extract "?id=123"
    const params = new URLSearchParams(queryString);
    return params.get(param);
};

export const checkType = (value) => {
    const checkType = typeof value;
    return checkType;
}