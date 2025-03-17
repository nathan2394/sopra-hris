import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { coverDate, formatText, getCurrentDate } from "../../config/helper";
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

const Overtime = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { deleteData, loadData } = useAPI();
    const [isSubmit, setIsSubmit] = useState(false);
    const [rowActive, setRowActive] = useState(0);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);

    const setColumns = [
        { field: "voucherNo", header: "No. SPL", alignment: "left"},
        { field: "employeeName", header: "Nama", alignment: "left", render: (_, row) => <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline"> {row?.employeeName} </Link> },
        { field: "tanggal", header: "Tanggal Lembur", alignment: "center", render: (_, row) => `${coverDate(row.startDate)}` },
        { field: "dateRange", header: "Jam Lembur", alignment: "center", render: (_, row) => `${coverDate(row.startDate, 'time')} - ${coverDate(row.endDate, 'time')}` },
        { field: "duration", header: "Durasi", alignment: "left", render: (value) => `${value ? value : 0} Jam` },
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

    const handleChangeSelect = (target, value) => {
        setFormData({
            ...formData,
            [target]: value,
          });
    }

    const handleAdd = () => {
        setShowForm(false);
    }

    const handleClick = (data) => {
        const overtimeData = listData?.find((obj) => obj?.id === data?.id);
        setFormData({
            employeeID: overtimeData?.employeeID,
            transDate: "",
            startDate: overtimeData?.startDate,
            endDate: overtimeData?.endDate,
            reasonID: overtimeData?.unattendanceTypeID,
            description: overtimeData?.description,
        })
        setRowActive(overtimeData?.id);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    return (
        <>
            <TitlePage label={'Data Lembur'} source={list} isAction={true} handleAdd={() => {
                setShowForm(true);
                setIsAdd(true);
                setIsEdit(false);
            }}/>
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        {/* <Table dataTable={listData} rowSettings={rowSettings} setWidth={'85%'} actionClick={handleClick} /> */}
                        <DataTable dataTable={listData} columns={setColumns} setWidth={'85%'} actionClick={handleClick} rowActive={rowActive} />
                        <div className="mx-2" />
                        <InputContent showForm={showForm}>
                            <div>
                                <div className="flex flex-row flex-wrap w-full">
                                    <SearchableSelect handleAction={handleChangeSelect} name={`employeeID`} useSearchIcon={true} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Cari Karyawan'} options={listEmployee} value={formData?.employeeID} isDisabled={isEdit} />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={formData?.startDate} type={'date'} />
                                    <div className="mx-2" />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Sampai Tanggal'} setName={'endDate'} setWidth="48%" value={formData?.endDate} type={'date'} />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Lerbur Dari'} setWidth="48%" setName={'startDate'} value={formData?.startDate} type={'time'} />
                                    <div className="mx-2" />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Lerbur Sampai'} setWidth="48%" setName={'endDate'} value={formData?.endDate} type={'time'} />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Jam'} setWidth="48%" value={0} readOnly={true} />
                                    <div className="mx-2" />
                                    <SearchableSelect handleAction={handleChangeSelect} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Keterangan Lembur'} placeHolder={'Keterangan Lembur'} setWidth="48%" options={listType} value={formData?.unattendanceTypeID} />
                                    <Input handleAction={handleChange} label={'Notes'} setName={''} placeholder={'isi alasan'} content="textarea" value={formData?.description} />
                                </div>
                            </div>
                            <div>
                                <div className="bg-[#ddd] mb-3 w-full h-[1.5px]" />
                                <div className="flex flex-row justify-between w-full">
                                    {isAdd &&
                                        <>
                                            <Button text="Close" setWidth={'100%'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => console.log('0')} />
                                            <div className="mx-1" />
                                            <Button text="Submit" setWidth={'100%'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => {
                                                handleAdd();
                                            }} />
                                        </>
                                    }
                                    {isEdit &&
                                        <Button text="Edit" setWidth={'100%'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => console.log('0')} />
                                    }
                                </div>
                            </div>
                        </InputContent>
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