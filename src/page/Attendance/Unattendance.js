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
import MyDatePicker from "../../component/date_picker";

const Unattendance = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { deleteData, loadData } = useAPI();
    const [isSubmit, setIsSubmit] = useState(false);
    const [rowActive, setRowActive] = useState(0);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);

    const setColumns = [
        { field: "voucherNo", header: "No. SKT", alignment: "left"},
        { field: "employeeName", header: "Nama", alignment: "left", render: (_, row) => <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline"> {row?.employeeName} </Link> },
        { field: "dateRange", header: "Tanggal Tidak Hadir", alignment: "center", render: (_, row) => `${coverDate(row.startDate)} - ${coverDate(row.endDate)}` },
        { field: "duration", header: "Durasi", alignment: "left", render: (value) => `${value ? value : 0} Hari` },
        { field: "unattendanceTypeName", header: "Tipe", alignment: 'left' },
        { field: "status", header: "Status", alignment: 'center', render: (_, row) => row?.isApproved1 || row?.isApproved2 ? <p className="font-normal text-[#369D00]"> Approved </p> : <p> Pending </p> }
    ]

    const [formData, setFormData] = useState({

        employeeID: '',
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
            setIsLoading(false);
        });

        loadData({url: 'UnattendanceTypes'}).then((res) => {
            setListType(res?.data?.map((obj) => ({
                value: obj?.unattendanceTypeID,
                label: obj?.name
            })))
        })
    }, [])

    const sampleData = [
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            pengajuan: '03/01/2025',
            tanggalTidakHadir: '03/01/2025 - 03/01/2025',
            Durasi: '1 hari',
            Tipe: 'S',
            Status: 'Pending',
        },
    ];

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
        setShowForm(false);
    }

    const handleClick = (data) => {
        const unattendanceData = listData?.find((obj) => obj?.id === data?.id);
        setFormData({
            employeeID: unattendanceData?.employeeID,
            unattendanceTypeID: unattendanceData?.unattendanceTypeID,
            startDate: unattendanceData?.startDate,
            endDate: unattendanceData?.endDate,
            description: unattendanceData?.description
        })
        setRowActive(unattendanceData?.id);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    return (
        <>
            <TitlePage label={'Data Cuti & Ijin'} source={list} isAction={true} handleAdd={() => {
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
                                    <SearchableSelect handleAction={handleChangeSelect} name={`employeeID`} useSearchIcon={true} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Cari Karyawan'} setWidth="48%" options={listEmployee} value={formData?.employeeID} isDisabled={isEdit} />
                                    <div className="mx-2" />
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Sisa Cuti'} setWidth="48%" value={0} readOnly={true}/>
                                    {/* <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={formData?.startDate} type={'date'} /> */}
                                    <MyDatePicker handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={formData?.startDate} />
                                    <div className="mx-2" />
                                    <MyDatePicker handleAction={handleChange} label={'Sampai Tanggal'} setName={'endDate'} setWidth="48%" value={formData?.endDate} />
                                    {/* <Input textAlign={'left'} handleAction={handleChange} label={'Sampai Tanggal'} setName={'endDate'} setWidth="48%" value={formData?.endDate} type={'date'} /> */}
                                    <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Hari'} setWidth="48%" value={0} readOnly={true} />
                                    <div className="mx-2" />
                                    <SearchableSelect handleAction={handleChangeSelect} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Tipe Cuti / Izin'} placeHolder={'Tipe Cuti / Izin'} setWidth="48%" options={listType} value={formData?.unattendanceTypeID} />
                                    <Input handleAction={handleChange} label={'Alasan'} setName={''} placeholder={'isi alasan'} content="textarea" />
                                </div>
                                <div className="w-full">
                                    <div className="flex flex-row items-center justify-between">
                                        <p className="text-xs">Lampiran</p>
                                        <IconImage size="small" source={add_g} />
                                    </div>
                                    <div className="h-[100px] flex items-center justify-center">
                                        <p className="text-center text-xs text-gray-400">Tidak ada Lampiran</p>
                                    </div>
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

export default Unattendance;