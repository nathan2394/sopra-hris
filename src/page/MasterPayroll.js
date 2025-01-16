import React, { useRef, useState } from "react";

import Button from "../component/button";
import Table from "../component/table";
import { exportToExcel, getCurrentDate } from "../config/helper";
import { close, download, excel } from "../config/icon";
import IconImage from "../component/icon_img";
import { loadData, postData } from "../config/api";
import LoadingIndicator from "../component/loading_indicator";

const MasterPayroll = () => {
  const fileInputRef = useRef(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [isUpload, setIsUpload] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadExport, setIsLoadExport] = useState(false);
  const [isLoadExportBank, setIsLoadExportBank] = useState(false);
  const [loadUpload, setLoadUpload] = useState(false);

  const [dataUploadTable, setDataUploadTable] = useState([]);
    
  const handleInputChange = (event) => {
    if(event.target.value){
      console.log(event.target.files[0]);
      setLoadUpload(true);
      setFileUpload(event.target.files[0]?.name); 
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
  
      postData({ url: `Salary/upload`, formData: formData })?.then((res) => {
        if(res?.data?.length > 0){
          const filteredData = res.data.map(obj =>
            Object.fromEntries(
              Object.entries(obj).filter(([key]) => !key.includes('ID'))
            )
          );
          setDataUploadTable(filteredData);
          setIsUpload(true);
          setLoadUpload(false);
        }
      });
    }else{
      setFileUpload(null);
      setIsUpload(false);
      setDataUploadTable([]);
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = () => {
    fileInputRef.current.click();
  }

  const exportFile = (type, event) => {
    if (event) {
      event.preventDefault();
    }

    if(type === 'bank'){
      setIsLoadExportBank(true);
    }else{
      setIsLoadExport(true);
    }

    loadData({ url: `Salary/generatedata`, params: [{title: 'filter', value: `type:${type}`}] }).then((res) => {
      const todayDate = getCurrentDate();
      const filteredData = res.data.map(obj =>
        Object.fromEntries(
          Object.entries(obj).filter(([key]) => !key.includes('ID'))
        )
      );
      exportToExcel(filteredData, `Data_${type}_${todayDate}`, `${type === 'bank' ? 'bank' : 'default'}`)
      if(type === 'bank'){
        setIsLoadExportBank(false);
      }else{
        setIsLoadExport(false);
      }
    });
  }

  const downloadTemplate = () => {
    setIsLoading(true);
    const todayDate = getCurrentDate();
    loadData({ url: `Salary/template` }).then((res) => {
      exportToExcel(res?.data, `Template_Salary_${todayDate}`)
      setIsLoading(false);
    });
  }

  const removeFile = () => {
    setFileUpload(null);
    setIsUpload(false);
    setDataUploadTable([]);
    fileInputRef.current.value = '';
  }

  return (
    <div className="px-4 max-w-full">
      <div className="flex flex-col">
        <Button text={'Download Template'} bgcolor={'#ddd'} isLoading={isLoading} handleAction={() => downloadTemplate()} icon={download} />
        <div className="flex flex-col mt-3 mb-4">
          <p className="text-xs text-black" id="file_input_help">Upload Payroll Data:</p>
          <div className="flex items-center justify-center w-full">
              <div className="relative w-full h-64">
                {fileUpload &&
                  <div className="absolute top-2 right-2 cursor-pointer" style={{zIndex: 9}} onClick={() => removeFile()}>
                    <IconImage size="normal" source={close} />
                  </div>
                }
                <label className="relative flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" onClick={uploadFile}>
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
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 ">CSV, XLSX or XLS</p>
                      </div>
                    }
                </label>
              </div>
          </div> 
          <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />
        </div>
      </div>

      <div className="bg-[#ddd] my-2 h-[2px]" />

      {loadUpload && <LoadingIndicator position="bottom" label="Calculate..." showText={true} size="large" /> }

      {isUpload && 
      <>
        <div className="flex flex-row justify-end">
          <Button text={'Export Payroll'} bgcolor={'#ddd'} isLoading={isLoadExport} handleAction={(e) => exportFile('payroll', e)} />
          <div className="mx-1" />
          <Button text={'Export to Bank'} bgcolor={'#ddd'} isLoading={isLoadExportBank} handleAction={(e) => exportFile('bank', e)} />
        </div>
        <div className="w-full overflow-x-auto">
          <Table dataTable={dataUploadTable} />
        </div>
      </>
      }
    </div>
  );
};
  
  export default MasterPayroll;
  