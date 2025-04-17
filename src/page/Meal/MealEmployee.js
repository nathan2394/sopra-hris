import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData, postFormData } from "../../config/api";
import { convertDate, exportToExcel, generateExcel, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { download, employee, filter, kehadiran, reload, shift, upload } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import SearchableSelect from "../../component/select2";
import StartEndDatePick from "../../component/startEndDatePick";
import { useAPI } from "../../config/fetchApi";
import MyDatePicker from "../../component/date_picker";
import { errorConfirmation } from "../../component/alertDialog";
import DataTable from "../../component/dataTable";

const MealEmployee = ({setIsLoading}) => {
  const navigate = useNavigate();
  const { deleteData, loadData, postFormData } = useAPI();
  const fileInputRef = useRef(null);
  const [isUpload, setIsUpload] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [dataUploadTable, setDataUploadTable] = useState([]);
  const [loadUpload, setLoadUpload] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const [listData, setListData] = useState([]);
  const [exportType, setExportType] = useState('employee');
  const [formData, setFormData] = useState({})
  const [listDatePeriod, setListDatePeriod] = useState([]);
  
  useEffect(() => {
    setIsLoadData(false);
  }, [])

  const chooseFile = () => {
    fileInputRef.current.click();
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputChange = (event) => {
      if(event.target.value){
          setLoadUpload(true);
          setFileUpload(event.target.files[0]?.name); 
          const formData = new FormData();
          formData.append('file', event.target.files[0]);
      
          handleUpload(formData);
      }else{
          setFileUpload(null);
          setIsUpload(false);
          setDataUploadTable([]);
          fileInputRef.current.value = '';
      }
  };

  const handleUpload = (formData) => {
    setIsLoading(true);
    postFormData({ url: `AllowanceMeals/upload`, formData: formData })?.then((res) => {
      if(res?.data?.length > 0){
        const filteredData = res.data.map(obj => {
          const filteredObj = Object.fromEntries(
            Object.entries(obj).filter(([key]) => !key.includes('ID') && !key.includes('month') && !key.includes('year') && !key.includes('dateIn') && !key.includes('dateUp') && !key.includes('userIn') && !key.includes('userIn') && !key.includes('isDeleted'))
          );
      
          return {
              ...filteredObj,
          };
        }); 
        setIsLoading(false);
        setIsLoadData(false);
        setDataUploadTable(filteredData);
      }
    })
  }

  const downloadTemplate = () => {
    const todayDate = getCurrentDate();
    if (formData?.transDate){
      loadData({ url: `AllowanceMeals/template`, params: [{title: 'date', value: formData?.transDate}] }).then((res) => {
        let arrObj = res?.data?.map((val) => ({
          "employeeID": val?.employeeID,
          "nik": val?.nik,
          "employeeName": val?.employeeName,
          "transDate": convertDate(val?.transDate, 'input'),
          "meal": null,
        }));

        let combineArr = [...arrObj];

        let listOptions = [{value: 1, label: 'ya'}, {value: 0, label: 'tidak'}];
        generateExcel(combineArr, listOptions, 1, 2, 69, `Template_Meal_${todayDate}`);
      });
    }else{
      errorConfirmation();
    }
  }

  const setColumns = [
    { field: 'employeeName', header: 'Nama Karyawan' },
    { field: 'nik', header: 'NIK'},
    { field: 'departmentName', header: 'Departemen' },
    { field: 'divisionName', header: 'Divisi' }
  ];

  return (
      <>
          <TitlePage label={'Uang Makan Karyawan'} source={shift} isAction={true}/>
          <div className="flex flex-row items-center">
          </div>
          <div>
              <div className="flex flex-row justify-between w-full">
                  <div className="mt-2 mr-4">
                      <div className="bg-white border border-[#ddd] rounded-lg p-4 mb-5">
                          <p className="font-bold text-sm">{'Rincian Informasi Payroll'}</p>
                          <div className="bg-[#ddd] my-3 h-[1.5px]" />
                          <div className="flex flex-row items-center">
                              <MyDatePicker handleAction={handleChange} name={'transDate'} placeholder="Pilih Tanggal"/>
                              <div className="mx-1" />
                          </div>
                          <div className="flex flex-col items-center justify-center pt-8">
                              <Button text={'Unduh Form'} setWidth="auto" bgcolor={baseColor} color={'white'} handleAction={() => downloadTemplate()} icon={download} />
                          </div>
                      </div>
                      <div className="bg-white border border-[#ddd] rounded-lg p-4">
                          <div className="flex flex-col items-center justify-center p-6">
                              <p className="font-bold text-lg py-4">Upload Data Disini</p>
                              <p className="font-normal text-xs text-center w-[300px] text-gray-500">Silahkan pilih “Unggah Form” untuk mengunggah form yang sudah diisi dengan data terbaru. Pastikan form sudah sama dengan form yang diunduh melalui “Unduh Form”.</p>
                              <div className="my-4" />
                              <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />
                              <Button text={'Unggah Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => chooseFile()} icon={upload} />
                          </div>
                      </div>
                  </div>
                  {/* <Table dataTable={dataUploadTable} isAction={true} detailPath={'/#'}  /> */}
                  <DataTable dataTable={dataUploadTable} columns={setColumns} />
              </div>
          </div>
      </>
  );
}

export default MealEmployee;