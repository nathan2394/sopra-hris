import React, { useEffect, useRef, useState } from "react";

import Button from "../component/button";
import Table from "../component/table";
import { coverDate, exportToExcel, formatText, getCurrentDate, getMonthName } from "../config/helper";
import { arrow_green, close, download, empty, excel, payroll, reload, save, upload } from "../config/icon";
import IconImage from "../component/icon_img";
import { loadData, postFormData } from "../config/api";
import LoadingIndicator from "../component/loading_indicator";
import { baseColor } from "../config/setting";
import TitlePage from "../component/titlePage";
import SearchableSelect from "../component/select2";

const MasterPayroll = ({setIsLoading}) => {
  const fileInputRef = useRef(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [isUpload, setIsUpload] = useState(false);

  const [isLoadTemplate, setIsLoadTemplate] = useState(false);
  const [isLoadExport, setIsLoadExport] = useState(false);
  const [loadUpload, setLoadUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportLabel, setExportLabel] = useState('');
  
  const [period, setPeriod] = useState('-');

  const [dataUploadTable, setDataUploadTable] = useState([]);
  const [dataUploadSummary, setDataUploadSummary] = useState([]);
  const [dataUploadTotal, setDataUploadTotal] = useState([]);

  const handleReloadUpload = (formData) => {
    setIsLoading(true);
    postFormData({ url: `Salary/upload`, formData: formData })?.then((res) => {
      if(res?.data?.length > 0){
        const filteredData = res.data.map(obj =>
          Object.fromEntries(
            Object.entries(obj).filter(([key]) => !key.includes('ID') && !key.includes('month') && !key.includes('year') && !key.includes('payrollType'))
          )
        );
        setPeriod(`${getMonthName(res?.data[0]?.month)} ${res?.data[0]?.year}`)
        setDataUploadTable(filteredData);
        setIsUpload(true);
        setIsLoading(false);
        setLoadUpload(false);

        if(res?.dataSummary){
          setDataUploadSummary(res?.dataSummary);
        }

        if(res?.dataSummaryTotal){
          setDataUploadTotal(res?.dataSummaryTotal);
        }
      }else{
        setIsLoading(false);
        setIsUpload(false);
        setLoadUpload(false);
      }
    });
  }
    
  const handleInputChange = (event) => {
    if(event.target.value){
      setLoadUpload(true);
      setFileUpload(event.target.files[0]?.name); 
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
  
      handleReloadUpload(formData);
    }else{
      setFileUpload(null);
      setIsUpload(false);
      setDataUploadTable([]);
      fileInputRef.current.value = '';
    }
  };

  const reloadFile = () => {
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    handleReloadUpload(formData);
    setLoadUpload(true);
    // setIsUpload(false);
    // fileInputRef.current.click();
  }

  const chooseFile = () => {
    fileInputRef.current.click();
  }

  const exportFile = (type, event) => {
    console.log(exportType, type)
    if (event) {
      event.preventDefault();
    }

    if(type === ''){
      alert('Please Select Export Type');
      return;
    }

    setIsLoadExport(true);

    loadData({ url: `Salary/generatedata`, params: [{title: 'filter', value: `type:${type}|month:1|year:2025`}] }).then((res) => {
      const todayDate = getCurrentDate();
      let filteredData = [];

      if(type === 'payroll'){
        filteredData = res?.data?.map((val) => (
          {
            "nik" : val?.nik,
            "name" : val?.employeeName,
            "department" : val?.department,
            "division" : val?.division,
            "type" : val?.employeeType,
            "group" : val?.groupName + ` (${val?.groupType})`, 
            "accountNo" : val?.accountNo,
            "month" : val?.month,
            "year" : val?.year,
            "startWorkingDate" : coverDate(val?.startWorkingDate),
            "hks" : val?.hks,
            "hka" : val?.hka,
            "att" : val?.att,
            "meal" : val?.meal,
            "absent" : val?.absent,
            "ovt" : val?.ovt,
            "late" : val?.late,
            "basicSalary" : val?.basicSalary,
            "uMakan": val?.uMakan,
            "uTransport": val?.uTransport,
            "uJabatan": val?.uJabatan,
            "uFunctional": val?.uFunctional,
            "utKhusus": val?.utKhusus,
            "utOperational": val?.utOperational,
            "uLembur": val?.uLembur,
            "allowanceTotal" : val?.allowanceTotal,
            "deductionTotal" : val?.deductionTotal,
            "thp" : val?.thp,
            "netto" : val?.netto,
            "bpjs" : val?.bpjs,
            "transferAmount" : val?.transferAmount
          }
        ))
      }else{
        filteredData = res?.data?.map((val) => (
          {
            "Acc. No.": val?.accountNo,
            "Trans. Amount" : Math.round(val?.netto),
            "emp.Number": val?.nik,
            "emp.Name": val?.name,
            "Dept": val?.departmentCode,
            "Trans. Date": coverDate(val?.transDate, 'custom')
          }
        ))
      }

      exportToExcel(filteredData, `Data_${type}_${todayDate}`, `${type === 'bank' ? 'bank' : 'default'}`)
      setIsLoadExport(false);
    });
  }

  const downloadTemplate = () => {
    setIsLoadTemplate(true);
    const todayDate = getCurrentDate();
    loadData({ url: `Salary/template` }).then((res) => {
      exportToExcel(res?.data, `Template_Salary_${todayDate}`, 'default')
      setIsLoadTemplate(false);
    });
  }

  const months = [
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

  const exportTypes = [
    {label: "Payroll", value: "payroll"},
    {label: "Bank", value: "bank"}
  ];

  return (
    <>
      <TitlePage label={'Master Payroll'} source={payroll} isAction={false} />
      <div className="flex flex-row justify-between items-center pt-1">
        <div className="flex flex-row items-center w-full">
          {/* <SearchableSelect placeHolder = 'Periode' setWidth="auto" options={months}  />
          <div className="mx-1" /> */}
          <Button text={'Unduh Form'} setWidth="auto" bgcolor={baseColor} color={'white'} isLoading={isLoadTemplate} handleAction={() => downloadTemplate()} icon={download} />
        </div>
        <div className="flex flex-row items-center justify-end w-full">
          <SearchableSelect placeHolder = 'Select Export Type' setWidth="185px" value={exportType} setValue={setExportType} options={exportTypes}  />
          <div className="mx-1" />
          <Button text={'Export Data'} setWidth={'auto'} bgcolor={baseColor} color={'white'} isLoading={isLoadExport} handleAction={(e) => exportFile(exportType, e)} />
        </div>
      </div>

      <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />

      {isUpload ?
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col mt-2 mr-2 w-[65%]">
            <div className="bg-white rounded-lg p-4 w-full">
              <p className="font-bold text-sm">{'Rincian Informasi Payroll'}</p>
              <div className="bg-[#ddd] my-3 h-[1.5px]" />
              <div className="min-h-[180px]">
                <div className="flex flex-row items-start">
                  <p className="font-normal text-xs pb-2 w-[100px]">Periode Payroll</p>
                  <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                  <p className="font-normal text-xs pb-2">{period}</p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="font-normal text-xs pb-2 w-[100px]">Jumlah Hari</p>
                  <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                  <p className="font-normal text-xs pb-2">{dataUploadTable?.[0]?.hks || 0}</p>
                </div>
                {/* <div className="flex flex-row items-start">
                  <p className="font-normal text-xs pb-2 w-[100px]">Jumlah Karyawan</p>
                  <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                  <p className="font-normal text-xs pb-2">{dataUploadTotal?.[0]?.hks || 0}</p>
                </div> */}
              </div>
              <div className="bg-[#ddd] my-3 h-[1.5px]" />
              <div className="flex flex-row justify-end">
                <Button text={'Upload Ulang'} setWidth={'auto'} bgcolor={'white'} showBorder={true} color={baseColor} handleAction={() => reloadFile()} icon={reload} />
                <div className="mx-1" />
                <Button text={'Simpan Data'} setWidth={'auto'} bgcolor={baseColor} showBorder={true} color={'white'}  icon={save} />
              </div>
            </div>

            <div className="w-full overflow-x-auto mt-4">
              <div className="flex flex-row bg-[#333333c3] text-white w-full rounded-t-lg">
                <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold">Division</p></div>
                <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold">Amt Transfer (Rp)</p></div>
                <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold">COUNT (#pax)</p></div>
                <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold">AVG (Amt/Cnt)</p></div>
              </div>
              {dataUploadSummary?.map((val, idx) => (
                <div className="flex flex-row bg-[#fff] w-full" key={idx}>
                  <div className="w-full p-2 bg-[#333333c3] text-white border border-[#ffffff11]"><p className="text-xs font-semibold uppercase">{formatText(val?.departmentName)}</p></div>
                  <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.amountTransfer)}</p></div>
                  <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.countEmployee)}</p></div>
                  <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.avgAmountEmployee)}</p></div>
                </div>
              ))}
              {dataUploadTotal?.map((val, idx) => (
                <div className="flex flex-row bg-[#3333337e] text-white w-full rounded-b-lg" key={idx}>
                  <div className="w-full p-2 bg-[#333333c3] text-center border border-[#ffffff11] rounded-bl-lg"><p className="text-xs font-semibold">Total</p></div>
                  <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold text-end">{formatText(val?.amountTransfer)}</p></div>
                  <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs font-semibold text-end">{formatText(val?.countEmployee)}</p></div>
                  <div className="w-full p-2 border border-[#ffffff11] rounded-br-lg"><p className="text-xs font-semibold text-end">{formatText(val?.avgAmountEmployee)}</p></div>
                </div>
              ))}
            </div>

          </div>
          <div className="w-full h-[560px] overflow-x-auto">
            <Table dataTable={dataUploadTable} />
          </div>
        </div>
        :
        <div className="border border-[#ddd] bg-[#ffffff] rounded-lg w-full my-2 min-h-[400px] flex flex-col items-center justify-center p-6">
          {loadUpload ? 
            <LoadingIndicator position="bottom" label="Calculate..." showText={true} size="large" />
            :
            <div className="flex flex-col items-center justify-center p-6">
              <p className="font-bold text-lg py-4">Upload Data Disini</p>
              <p className="font-normal text-xs text-center w-[300px] text-gray-500">Silahkan pilih “Unggah Form” untuk mengunggah form yang sudah diisi dengan data terbaru. Pastikan form sudah sama dengan form yang diunduh melalui “Unduh Form”.</p>
              <div className="my-4" />
              <Button text={'Unggah Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => chooseFile()} icon={upload} />
            </div>
          }
        </div>
      }

      {/* <div className="flex flex-row justify-between items-center pt-2">
        <p className="font-bold text-sm">Payroll Period : <span className="font-semibold text-gray-500">{period}</span></p>
        <div className="flex flex-row">
          <div style={ !isUpload ? { opacity: '0.3', pointerEvents: 'none' } : {}}>
            <Button setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => reloadFile()} icon={reload} />
          </div>
          <div className="mx-1" />
          <Button text={'Upload Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => chooseFile()} icon={upload} />
          <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />
        </div>
      </div> */}

    </>
  );
};
  
export default MasterPayroll;  