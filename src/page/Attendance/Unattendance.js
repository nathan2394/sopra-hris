import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { coverDate, exportToExcel, getCurrentDate } from "../../config/helper";
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

const Unattendance = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { deleteData, loadData } = useAPI();
    const [isSubmit, setIsSubmit] = useState(false);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([
        {
            label: 'Alpha / Mangkir',
            value: 'A'
        },
        {
            label: 'Ijin Pribadi',
            value: 'I'
        },
        {
            label: 'Sakit SDK',
            value: 'S'
        }
    ]);
    const [isLoadData, setIsLoadData] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        nik: '',
        ktp: '',
        gender: '',
        religion: '',
        email: '',
        phoneNumber: '',
        placeOfBirth: '',
        dateOfBirth: '',
        startWorkingDate: '',
        startJointDate: '',
        endWorkingDate: '',
        motherMaidenName: '',
        education: '',
        functionID: '',
        departmentID: '',
        groupID: '',
        accountNo: '',
        bank: '',
        payrollType: '',
        bpjstk: '0',
        bpjskes: '0',
        tkStatus: '',
        taxStatus: '',
        divisionID: '',
        basicSalary: 0,
        employeeTypeID: '',
        employeeJobTitleName: '',
        employeeJobTitleID: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        loadData({url: 'Employees'}).then((res) => {
            setListEmployee(res?.data?.map((obj) => ({
                label: obj?.employeeName,
                value: obj?.employeeID
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
        console.log(data);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    return (
        <>
            <TitlePage label={'Data Ketidakhadiran'} source={list} isAction={true} handleAdd={() => {
                setShowForm(true);
                setIsAdd(true);
                setIsEdit(false);
            }}/>
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        <Table dataTable={sampleData} setWidth={'85%'} actionClick={handleClick} />
                        <div className="mx-2" />
                        <InputContent showForm={showForm}>
                            <div className="flex flex-row flex-wrap w-full">
                                <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} useSearchIcon={true} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Cari Karyawan'} setWidth="48%" options={[]} value={null} isDisabled={isEdit} />
                                <div className="mx-2" />
                                <Input textAlign={'left'} handleAction={handleChange} label={'Sisa Cuti'} setName={'hks'} setWidth="48%" value={0} readOnly={true}/>
                                <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'hks'} setWidth="48%" value={null} type={'date'} />
                                <div className="mx-2" />
                                <Input textAlign={'left'} handleAction={handleChange} label={'Sampai Tanggal'} setName={'hka'} setWidth="48%" value={null} type={'date'} />
                                <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Hari'} setName={'hka'} setWidth="48%" value={0} readOnly={true}/>
                                <div className="mx-2" />
                                <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={[]} value={null} />
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
                                    <Button text="Edit" setWidth={'100%'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => console.log('0')} />
                                }
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