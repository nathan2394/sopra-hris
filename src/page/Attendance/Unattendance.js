import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { convertDate, filterUniqueList, formatText, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { add_g, employee, filter, kehadiran, list, reload } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import SearchableSelect from "../../component/select2";
import InputContent from "../../component/sections/inputContent";
import { useAPI } from "../../config/fetchApi";
import DataTable from "../../component/dataTable";
import MyDatePicker from "../../component/date_picker";
import FormUnattendance from "../../component/sections/formUnattendance";

const Unattendance = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { deleteData, loadData } = useAPI();
    const [isSubmit, setIsSubmit] = useState(false);
    const [rowActive, setRowActive] = useState(0);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);

    const [btnApprove, setBtnApprove] = useState(false);

    const setColumns = [
        { field: "voucherNo", header: "No. SKT", alignment: "left"},
        { field: "employeeName", header: "Nama", alignment: "left", render: (_, row) => <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline"> {row?.employeeName} </Link> },
        { field: "dateRange", header: "Tanggal Tidak Hadir", alignment: "center", render: (_, row) => `${convertDate(row.startDate)} - ${convertDate(row.endDate)}` },
        { field: "duration", header: "Durasi", alignment: "left", render: (value) => `${value ? value : 0} Hari` },
        { field: "unattendanceTypeName", header: "Tipe", alignment: 'left' },
        { field: "status", header: "Status", alignment: 'center', render: (_, row) => row?.isApproved1 || row?.isApproved2 ? <p className="font-normal text-[#369D00]"> Approved </p> : <p> Pending </p> }
    ]

    const [formData, setFormData] = useState({
        employeeID: '',
        duration: '',
        unattendanceTypeID: '',
        startDate: '',
        endDate: '',
        description: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        loadData({url: 'Employees'}).then((res) => {
            setListEmployee(res?.data?.map((obj) => ({
                label: obj?.employeeName,
                value: obj?.employeeID
            })))
        });

        loadData({url: 'Unattendances'}).then((res) => {  
            const filteredData = res?.data.map(obj => {
                const filteredObj = Object.fromEntries(
                    Object.entries(obj).filter(([key]) => 
                        !key.includes('dateIn') &&  
                        !key.includes('dateUp') &&  
                        !key.includes('userIn') &&  
                        !key.includes('userUp') &&  
                        !key.includes('isDeleted')
                    )
                );
            
                return {
                    id: obj?.unattendanceID,
                    ...filteredObj,
                };
            }); 
            setListData(filteredData);

            localStorage?.setItem('employeeList', JSON.stringify(filterUniqueList(filteredData, 'employeeID', (obj, idx) => ({
                id: obj?.employeeID,
                name: obj?.employeeName,
                nik: obj?.nik,
                ktp: obj?.ktp,
                index: idx
            }))));
            setIsLoading(false);
        });

        loadData({url: 'UnattendanceTypes'}).then((res) => {
            setListType(res?.data?.map((obj) => ({
                value: obj?.unattendanceTypeID,
                label: obj?.name
            })))
        })
    }, [])

    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };

    const handleChangeSelect = (target, value) => {
        setFormData({
            ...formData,
            [target]: value,
          });
    }

    const handleAdd = () => {
        setShowForm(true);
        setIsAdd(true);
        setIsEdit(false);
        setRowActive(0);
        setBtnApprove(false);
        setFormData({
            employeeID: 0,
            duration: 0,
            unattendanceTypeID: 0,
            startDate: new Date(),
            endDate: new Date(),
            description: ''
        })
    }

    const handleClick = (data) => {
        const unattendanceData = listData?.find((obj) => obj?.id === data?.id);
        setFormData({
            employeeID: unattendanceData?.employeeID,
            duration: unattendanceData?.duration,
            unattendanceTypeID: unattendanceData?.unattendanceTypeID,
            startDate: unattendanceData?.startDate,
            endDate: unattendanceData?.endDate,
            description: unattendanceData?.description
        })
        setRowActive(unattendanceData?.id);
        setBtnApprove(unattendanceData?.isApproved1 || unattendanceData?.isApproved2 ? false : true);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    return (
        <>
            <TitlePage label={'Data Cuti & Ijin'} source={list} isAction={true} handleAdd={() => handleAdd()}/>
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        {/* <Table dataTable={listData} rowSettings={rowSettings} setWidth={'85%'} actionClick={handleClick} /> */}
                        <DataTable dataTable={listData} columns={setColumns} setWidth={'85%'} actionClick={handleClick} rowActive={rowActive} />
                        <div className="mx-2" />
                        <FormUnattendance showForm={showForm} dataObj={formData} setWidth={'45%'} listType={listType} listEmployee={listEmployee} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnApprove={btnApprove}/>
                    </div>
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
        </>
    );
}

export default Unattendance;