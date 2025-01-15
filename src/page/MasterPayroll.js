import React, { useRef, useState } from "react";

import Button from "../component/button";
import Search from "../component/search";
import Table from "../component/table";
import { exportToXML, ExportXML } from "../config/helper";
import { excel } from "../config/icon";
import IconImage from "../component/icon_img";

const MasterPayroll = () => {
  const fileInputRef = useRef(null);
  const [fileUpload, setFileUpload] = useState('');
  const [isUpload, setIsUpload] = useState(false);

  const dataTable = {
    "data": [
      {
        "employeeID": 13,
        "nik": "NIK00010",
        "name": "Employee 10",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 12,
        "nik": "NIK00009",
        "name": "Employee 9",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 11,
        "nik": "NIK00008",
        "name": "Employee 8",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 10,
        "nik": "NIK00007",
        "name": "Employee 7",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 9,
        "nik": "NIK00006",
        "name": "Employee 6",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 8,
        "nik": "NIK00005",
        "name": "Employee 5",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 7,
        "nik": "NIK00004",
        "name": "Employee 4",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 6,
        "nik": "NIK00003",
        "name": "Employee 3",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 5,
        "nik": "NIK00002",
        "name": "Employee 2",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 4,
        "nik": "NIK00001",
        "name": "Employee 1",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      },
      {
        "employeeID": 2,
        "nik": "01",
        "name": "nathan",
        "hks": null,
        "hka": null,
        "att": null,
        "late": null,
        "ovt": null,
        "otherAllowances": null,
        "otherDeductions": null,
        "month": 1,
        "year": 2025
      }
    ]
  }

  const dataUploadTable = {
    "dataPayroll": [
      {
        "salaryID": 0,
        "employeeID": 13,
        "nik": "NIK00010",
        "name": "Employee 10",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 20,
        "att": 20,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1650000,
        "otherDeductions": 0,
        "thp": 9650000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 12,
        "nik": "NIK00009",
        "name": "Employee 9",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 20,
        "att": 19,
        "ovt": 0,
        "late": 1,
        "otherAllowances": 1615000,
        "otherDeductions": 0,
        "thp": 9615000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 11,
        "nik": "NIK00008",
        "name": "Employee 8",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 20,
        "att": 20,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1850000,
        "otherDeductions": 0,
        "thp": 11850000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 10,
        "nik": "NIK00007",
        "name": "Employee 7",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 20,
        "att": 20,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1750000,
        "otherDeductions": 0,
        "thp": 10750000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 9,
        "nik": "NIK00006",
        "name": "Employee 6",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 20,
        "att": 19,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1815000,
        "otherDeductions": 0,
        "thp": 11815000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 8,
        "nik": "NIK00005",
        "name": "Employee 5",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 18,
        "att": 18,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1580000,
        "otherDeductions": 0,
        "thp": 1580000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 7,
        "nik": "NIK00004",
        "name": "Employee 4",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 18,
        "att": 18,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1580000,
        "otherDeductions": 0,
        "thp": 1580000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 6,
        "nik": "NIK00003",
        "name": "Employee 3",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 19,
        "att": 19,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1415000,
        "otherDeductions": 0,
        "thp": 1415000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 5,
        "nik": "NIK00002",
        "name": "Employee 2",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 19,
        "att": 19,
        "ovt": 0,
        "late": 1,
        "otherAllowances": 1515000,
        "otherDeductions": 0,
        "thp": 1515000,
        "payrollType": ""
      },
      {
        "salaryID": 0,
        "employeeID": 4,
        "nik": "NIK00001",
        "name": "Employee 1",
        "employeeTypeID": 1,
        "employeeTypeName": "Karyawan Kontrak",
        "groupID": 1,
        "groupName": "",
        "functionID": 1,
        "functionName": "Operator",
        "divisionID": 1,
        "divisionName": "Bottle",
        "month": 1,
        "year": 2025,
        "hks": 20,
        "hka": 19,
        "att": 19,
        "ovt": 0,
        "late": 0,
        "otherAllowances": 1815000,
        "otherDeductions": 0,
        "thp": 1815000,
        "payrollType": ""
      }
    ],
    "dataBank": [
      {
        "salaryID": 0,
        "employeeID": 13,
        "nik": "NIK00010",
        "name": "Employee 10",
        "accountNo": "ACC00010",
        "bank": "BCA",
        "thp": 9650000
      },
      {
        "salaryID": 0,
        "employeeID": 12,
        "nik": "NIK00009",
        "name": "Employee 9",
        "accountNo": "ACC00009",
        "bank": "BCA",
        "thp": 9615000
      },
      {
        "salaryID": 0,
        "employeeID": 11,
        "nik": "NIK00008",
        "name": "Employee 8",
        "accountNo": "ACC00008",
        "bank": "BCA",
        "thp": 11850000
      },
      {
        "salaryID": 0,
        "employeeID": 10,
        "nik": "NIK00007",
        "name": "Employee 7",
        "accountNo": "ACC00007",
        "bank": "BCA",
        "thp": 10750000
      },
      {
        "salaryID": 0,
        "employeeID": 9,
        "nik": "NIK00006",
        "name": "Employee 6",
        "accountNo": "ACC00006",
        "bank": "BCA",
        "thp": 11815000
      },
      {
        "salaryID": 0,
        "employeeID": 8,
        "nik": "NIK00005",
        "name": "Employee 5",
        "accountNo": "ACC00005",
        "bank": "BCA",
        "thp": 1580000
      },
      {
        "salaryID": 0,
        "employeeID": 7,
        "nik": "NIK00004",
        "name": "Employee 4",
        "accountNo": "ACC00004",
        "bank": "BCA",
        "thp": 1580000
      },
      {
        "salaryID": 0,
        "employeeID": 6,
        "nik": "NIK00003",
        "name": "Employee 3",
        "accountNo": "ACC00003",
        "bank": "BCA",
        "thp": 1415000
      },
      {
        "salaryID": 0,
        "employeeID": 5,
        "nik": "NIK00002",
        "name": "Employee 2",
        "accountNo": "ACC00002",
        "bank": "BCA",
        "thp": 1515000
      },
      {
        "salaryID": 0,
        "employeeID": 4,
        "nik": "NIK00001",
        "name": "Employee 1",
        "accountNo": "ACC00001",
        "bank": "BCA",
        "thp": 1815000
      }
    ]
  }
    
  const handleInputChange = (event) => {
    setFileUpload(event.target.value); // Update state when the input changes
  };

  const uploadFile = () => {
    fileInputRef.current.click();
  }

  const importFile = () => {
    exportToXML(dataUploadTable?.dataPayroll, 'Data Payroll');
    exportToXML(dataUploadTable?.dataBank, 'Data Bank');
    setFileUpload('');
    setIsUpload(true);
  }

  const downloadFile = () => {
    exportToXML(dataTable?.data);
  }

  return (
    <div>
      <div className="flex flex-col">
        <Button text={'Download Data'} bgcolor={'#ddd'} handleAction={downloadFile} />
        <div className="flex flex-col mt-2 mb-4">
          <p class="text-xs text-black" id="file_input_help">Upload Payroll Data:</p>
          <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" onClick={uploadFile}>
                  {fileUpload ? 
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="mb-4">
                        <IconImage size={'large'} source={excel} />
                      </div>
                      <p className="mb-2 text-sm text-gray-500">{fileUpload}</p>
                    </div>
                    :                  
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 ">CSV, XLSX or XLS</p>
                    </div>
                  }
                  {/* <input id="dropzone-file" type="file" className="hidden" /> */}
              </label>
          </div> 
          <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" value={fileUpload} onChange={handleInputChange} />
        </div>
        <Button text={'Upload'} bgcolor={'#ddd'} handleAction={importFile} />
      </div>

      {/* <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row">
            <Button text={'Choose File'} bgcolor={'#ddd'} handleAction={uploadFile} />
            <div className="mx-1" />
            <Button text={'Upload'} bgcolor={'#eee'} handleAction={importFile} />
          </div>
          <input className="hidden" ref={fileInputRef} type="file" value={fileUpload} onChange={handleInputChange} />
          {fileUpload && <p className="text-xs italic">{fileUpload}</p>}
        </div>
        <div className="flex flex-row items-center">
          <Button text={'Export'} bgcolor={'#ddd'} handleAction={downloadFile} />
          <div className="mx-1" />
          <Search type={'text'} placeholder={'search...'} />
        </div>
      </div>
      {isUpload &&      
        <div className="w-full">
          <Table />
        </div>
      } */}
    </div>
  );
};
  
  export default MasterPayroll;
  