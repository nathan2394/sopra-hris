import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { convertDate, formatText, getCurrentDate } from "../../config/helper";
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
import FormOvertime from "../../component/sections/formOvertime";

const Overtime = ({setIsLoading}) => {
    const { deleteData, loadData } = useAPI();
    const [isSubmit, setIsSubmit] = useState(false);
    const [rowActive, setRowActive] = useState(0);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);

    const [btnApprove, setBtnApprove] = useState(false);

    const setColumns = [
        { field: "voucherNo", header: "No. SPL", alignment: "left"},
        { field: "employeeName", header: "Nama", alignment: "left", render: (_, row) => <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline"> {row?.employeeName} </Link> },
        { field: "tanggal", header: "Tanggal Lembur", alignment: "center", render: (_, row) => `${convertDate(row.startDate)}` },
        { field: "dateRange", header: "Jam Lembur", alignment: "center", render: (_, row) => `${convertDate(row.startDate, 'time')} - ${convertDate(row.endDate, 'time')}` },
        { field: "reasonName", header: "Keterangan", alignment: 'left' },
        { field: "status", header: "Status", alignment: 'center', render: (_, row) => row?.isApproved1 || row?.isApproved2 ? <p className="font-normal text-[#369D00]"> Approved </p> : <p> Pending </p> }
    ]

    const [formData, setFormData] = useState({
        employeeID: 0,
        transDate: "",
        startDate: "",
        endDate: "",
        reasonID: 0,
        description: "",
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

        loadData({url: 'Overtimes'}).then((res) => {  
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
                    id: obj?.overtimeID,
                    ...filteredObj,
                };
            }); 
            setListData(filteredData);
            setIsLoading(false);
        });

        loadData({url: 'Reasons'}).then((res) => {
            setListType(res?.data?.map((obj) => ({
                value: obj?.reasonID,
                label: obj?.name
            })))
        })
    }, [])

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };

    const handleAdd = () => {
        setShowForm(true);
        setBtnApprove(false);
        setIsAdd(true);
        setIsEdit(false);
        setRowActive(0);
        setFormData({
            employeeID: 0,
            transDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            reasonID: 0,
            description: "",
        })
    }

    const handleClick = (data) => {
        const overtimeData = listData?.find((obj) => obj?.id === data?.id);
        setFormData({
            employeeID: overtimeData?.employeeID,
            transDate: "",
            startDate: overtimeData?.startDate,
            endDate: overtimeData?.endDate,
            reasonID: overtimeData?.reasonID,
            description: overtimeData?.description,
        })
        setBtnApprove(overtimeData?.isApproved1 || overtimeData?.isApproved2 ? true : false);
        setRowActive(overtimeData?.id);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    return (
        <>
            <TitlePage label={'Data Lembur'} source={list} isAction={true} handleAdd={() => handleAdd()}/>
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        <DataTable dataTable={listData} columns={setColumns} setWidth={'95%'} actionClick={handleClick} rowActive={rowActive} />
                        <div className="mx-2" />
                        <FormOvertime showForm={showForm} dataObj={formData} setWidth={'45%'} listType={listType} listEmployee={listEmployee} handleChange={handleChange} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnApprove={btnApprove}/>
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

export default Overtime;