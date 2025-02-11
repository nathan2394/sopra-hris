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

export const coverDate = (val, displayYear = 'default') => {
    if(val){
        const inputDate = val;
        const date = new Date(inputDate);
    
        if(displayYear !== 'default'){
            let day = date.getDate();
            let month = date.getMonth() + 1; // Months are zero based
            let year = date.getFullYear().toString().slice(-2); // Get last two digits of year
          
            // Pad day and month with leading zeros if needed
            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;
          
            // Return formatted date
            return `${day}/${month}/${year}`;
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
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return coverDate(value);
        }
        return value;
    }
};

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