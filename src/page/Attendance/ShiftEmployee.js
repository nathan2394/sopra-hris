import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
import { deleteData, loadData } from "../../config/api";
import { coverDate, exportToExcel, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { download, employee, filter, kehadiran, reload, shift } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import SearchableSelect from "../../component/select2";

const ShiftEmployee = ({setIsLoading}) => {
    const navigate = useNavigate();

    const [isLoadData, setIsLoadData] = useState(true);
    const [listData, setListData] = useState([]);
    const [exportType, setExportType] = useState('employee');

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

    const downloadTemplate = () => {
      console.log('testing')
    }

    return (
        <>
            <TitlePage label={'Grup Shift Karyawan'} source={shift} type="detail" subMenu={subMenu} isAction={true}/>
            <div className="flex flex-row items-center">
              <SearchableSelect placeHolder = 'Select Export Type' setWidth="185px" value={exportType} setValue={setExportType} options={exportTypes}  />
              <div className="mx-1" />
              <Button text={'Unduh Form'} setWidth="auto" bgcolor={baseColor} color={'white'} handleAction={() => downloadTemplate()} icon={download} />
            </div>
            <div>
                {!isLoadData ? 
                    <Table dataTable={listData} isAction={true} detailPath={'/employee/detail?id='}  />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
        </>
    );
}

export default ShiftEmployee;