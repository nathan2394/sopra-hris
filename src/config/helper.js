import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    {label: "2025", value: 2025}, 
    {label: "2024", value: 2024}, 
    {label: "2023", value: 2023}, 
    {label: "2022", value: 2022}, 
    {label: "2021", value: 2021}, 
    {label: "2020", value: 2020}, 
    {label: "2019", value: 2019}, 
    {label: "2018", value: 2018}, 
    {label: "2017", value: 2017}, 
    {label: "2016", value: 2016}, 
    {label: "2015", value: 2015}, 
    {label: "2014", value: 2014}
];

export const currYear = new Date().getFullYear();

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

export const getPrevNextIds = (currentId, data) => {
    
    // Find the index of the current item
    const currentIndex = data?.findIndex(item => String(item.id) === String(currentId));
    // console.log('trigger', currentId, data, currentIndex)
    if (currentIndex === -1) return { prevId: null, nextId: null };

    // Get previous and next IDs
    const prevId = currentIndex > 0 ? data[currentIndex - 1].id : null;
    const nextId = currentIndex < data.length - 1 ? data[currentIndex + 1].id : null;

    console.log(prevId, nextId);

    return { prevId, nextId };
}