import React, { useRef, useState } from "react";

import Button from "../component/button";
import Table from "../component/table";
import { coverDate, exportToExcel, formatText, getCurrentDate, getMonthName } from "../config/helper";
import { arrow_green, close, download, empty, excel, payroll, reload, upload } from "../config/icon";
import IconImage from "../component/icon_img";
import { loadData, postFormData } from "../config/api";
import LoadingIndicator from "../component/loading_indicator";
import { baseColor } from "../config/setting";
import TitlePage from "../component/titlePage";

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
    setIsUpload(false);
  }

  const chooseFile = () => {
    fileInputRef.current.click();
  }

  const exportFile = (type, event) => {
    if (event) {
      event.preventDefault();
    }

    if(type === ''){
      alert('Please Select Export Type');
      return;
    }

    setIsLoadExport(true);

    loadData({ url: `Salary/generatedata`, params: [{title: 'filter', value: `type:${type}`}] }).then((res) => {
      const todayDate = getCurrentDate();
      let filteredData = [];
      
      // filteredData = res.data.map(obj =>
      //   Object.fromEntries(
      //     Object.entries(obj).filter(([key]) => !key.includes('ID')  && !key.includes('dateIn')  && !key.includes('dateUp')  && !key.includes('userIn') && !key.includes('userUp') && !key.includes('isDeleted') )
      //   )
      // );

      if(type === 'payroll'){
        filteredData = res?.data?.map((val) => (
          {
            "nik" : val?.nik,
            "name" : val?.name,
            "department" : val?.departmentName,
            "division" : val?.divisionName,
            "type" : val?.employeeTypeName,
            "group" : val?.groupName + ` (${val?.groupType})`, 
            "month" : val?.month,
            "year" : val?.year,
            "hks" : val?.hks,
            "hka" : val?.hka,
            "att" : val?.att,
            "meal" : val?.meal,
            "absent" : val?.absent,
            "ovt" : val?.ovt,
            "late" : val?.late,
            "allowanceTotal" : val?.allowanceTotal,
            "deductionTotal" : val?.deductionTotal,
            "thp" : val?.netto,
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
            "Dept": val?.departmentName,
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
      exportToExcel(res?.data, `Template_Salary_${todayDate}`)
      setIsLoadTemplate(false);
    });
  }

  return (
    <>
      <TitlePage label={'Master Payroll'} source={payroll} isAction={false} />

      <div className="flex flex-row justify-between items-center pt-1">
        <Button text={'Download Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} isLoading={isLoadTemplate} handleAction={() => downloadTemplate()} icon={download} />
        <div className="flex flex-row">
          <div className="py-2 relative" style={ !isUpload ? { opacity: '0.3', pointerEvents: 'none' } : {}}>
            <div className="border border-gray-400 bg-[#ffffff] rounded-lg flex flex-row items-center mr-2 cursor-pointer" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)', userSelect: 'none'}} onClick={() => setOpen(!open)}>
              <div className="p-2 w-[145px]">
                <p className="text-sm font-semibold">{`${exportLabel || 'Select Export Type'}`}</p>
              </div>
              <div className="bg-gray-400 h-[36px] w-[1px]"></div>
              <div className="p-2">
                  <IconImage size="small" source={arrow_green} />
              </div>
            </div>
            {open &&             
              <div className="absolute top-14 border border-gray-400 bg-[#ffffff] rounded-lg w-[180px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                <div className="cursor-pointer p-1 border-b border-gray-400 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => {
                  setExportType('payroll')
                  setExportLabel('Export Payroll')
                  setOpen(false)
                }}>
                  <p className="text-sm font-semibold">Export Payroll</p>
                </div>
                <div className="cursor-pointer p-1 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => {
                  setExportType('bank')
                  setExportLabel('Export for Bank')
                  setOpen(false)
                }}>
                  <p className="text-sm font-semibold">Export for Bank</p>
                </div>
              </div>
            }
          </div>
          <Button text={'Export Data'} setWidth={'auto'} bgcolor={baseColor} color={'white'} isLoading={isLoadExport} handleAction={(e) => exportFile(exportType, e)} />
        </div>
      </div>

      {isUpload &&
        <div className="my-4">
          <p className="font-bold text-sm mb-1">Summary:</p>
          <div className="w-full overflow-x-auto">
            <div className="flex flex-row bg-[#ddd] w-full rounded-t-lg">
              <div className="w-full p-2 border border-[#ddd] rounded-t-lg"><p className="text-sm font-semibold">Division</p></div>
              <div className="w-full p-2 border border-[#ddd]"><p className="text-sm font-semibold">Amt Transfer (Rp)</p></div>
              <div className="w-full p-2 border border-[#ddd]"><p className="text-sm font-semibold">COUNT (#pax)</p></div>
              <div className="w-full p-2 border border-[#ddd] rounded-t-lg"><p className="text-sm font-semibold">AVG (Amt/Cnt)</p></div>
            </div>
            {dataUploadSummary?.map((val, idx) => (
              <div className="flex flex-row bg-[#eee] w-full" key={idx}>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs font-semibold uppercase">{formatText(val?.departmentName)}</p></div>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.amountTransfer)}</p></div>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.countEmployee)}</p></div>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.avgAmountEmployee)}</p></div>
              </div>
            ))}
            {dataUploadTotal?.map((val, idx) => (
              <div className="flex flex-row bg-[#ddd] w-full rounded-b-lg" key={idx}>
                <div className="w-full p-2 border border-[#ddd] rounded-b-lg"><p className="text-sm font-semibold">Total</p></div>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-sm font-semibold text-end">{formatText(val?.amountTransfer)}</p></div>
                <div className="w-full p-2 border border-[#ddd]"><p className="text-sm font-semibold text-end">{formatText(val?.countEmployee)}</p></div>
                <div className="w-full p-2 border border-[#ddd] rounded-b-lg"><p className="text-sm font-semibold text-end">{formatText(val?.avgAmountEmployee)}</p></div>
              </div>
            ))}
          </div>
        </div>
      }

      {isUpload ?
        <div className="w-full overflow-x-auto">
          <Table dataTable={dataUploadTable} />
        </div>
        :
        <div className="border border-[#ddd] bg-[#ffffff] rounded-lg w-full my-2 min-h-[400px] flex flex-col items-center justify-center p-6">
          {loadUpload ? 
            <LoadingIndicator position="bottom" label="Calculate..." showText={true} size="large" />
            :
            <div className="flex flex-col items-center justify-center p-6">
              <img className="w-[28%] mx-auto" alt="logo" src={empty} />
              <p className="font-bold text-sm">Opps, Nothing to See Here!</p>
              <p className="font-normal text-xs text-center w-[300px] text-gray-500">Nothing to see here yet. Please upload your payroll form by clicking the “Upload Form” button.</p>
            </div>
          }
        </div>
      }

      <div className="flex flex-row justify-between items-center pt-2">
        <p className="font-bold text-sm">Payroll Period: <span className="font-semibold text-gray-500">{period}</span></p>
        <div className="flex flex-row">
          <div style={ !isUpload ? { opacity: '0.3', pointerEvents: 'none' } : {}}>
            <Button setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => reloadFile()} icon={reload} />
          </div>
          <div className="mx-1" />
          <Button text={'Upload Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => chooseFile()} icon={upload} />
          <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />
        </div>
      </div>

    </>
  );
};
  
  export default MasterPayroll;
  