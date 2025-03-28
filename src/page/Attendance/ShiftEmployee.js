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

const ShiftEmployee = ({setIsLoading}) => {
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

    const [listDatePeriod, setListDatePeriod] = useState([]);

    const exportTypes = [
      {
        label: 'By Data Karyawan',
        value: 'employee'
      },
      {
        label: 'By Group Karyawan',
        value: 'groupshift'
      }
    ]

    const subMenu = [ 
      {
        title: 'Unggah Data Shift',
        navRoute: `/employee/detail?id=`,
      },
      {
        title: 'Data Shift',
        navRoute: '/employee/salaryreport?id=',
      }
    ];

    useEffect(() => {
      setIsLoadData(false);
    }, [])

    const chooseFile = () => {
      fileInputRef.current.click();
    }

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
      postFormData({ url: `EmployeeShifts/upload`, formData: formData })?.then((res) => {
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
      loadData({ url: `EmployeeShifts/template`, params: [{title: 'filter', value: `type:${exportType}`}] }).then((res) => {
        let arrObj = exportType === 'employee' ? res?.data?.map((val) => ({
          employeeID: val?.employeeID,
          nik: val?.nik,
          name: val?.name,
        })) : res?.data?.map((val) => ({
          groupShiftID: val?.groupShiftID,
          groupShiftCode: val?.groupShiftCode,
          groupShiftName: val?.groupShiftName
        }));

        let arrObj2 = listDatePeriod?.map((val) => ({
          [val?.date]: ''
        }));
        let combineArr = [...arrObj, ...arrObj2];

        let listOptions = res?.shifts?.map((val) => ({
          code: val?.code,
          name: val?.name
        })) ?? [];
        //exportToExcel(combineArr, `Template_Shift_${todayDate}`, 'default');
        generateExcel(combineArr, listOptions, listDatePeriod?.length, listOptions?.length, `Template_Shift_${todayDate}`);
      });
    }

    return (
        <>
            <TitlePage label={'Grup Shift Karyawan'} source={shift} subMenu={subMenu} isAction={true}/>
            <div className="flex flex-row items-center">
              <StartEndDatePick setList={setListDatePeriod} />
              <SearchableSelect placeHolder = 'Select Export Type' setWidth="185px" value={exportType} setValue={setExportType} options={exportTypes}  />
              <div className="mx-1" />
              <Button text={'Unduh Form'} setWidth="auto" bgcolor={baseColor} color={'white'} handleAction={() => downloadTemplate()} icon={download} />
            </div>
            <div>
                {!isLoadData ? 
                    <Table dataTable={dataUploadTable} isAction={true} detailPath={'/#'}  />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
                <input className="hidden" ref={fileInputRef} type="file" accept=".csv, .xlsx, .xls" onChange={handleInputChange} />
                <Button text={'Unggah Form'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => chooseFile()} icon={upload} />
            </div>
        </>
    );
}

export default ShiftEmployee;