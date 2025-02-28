import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
import { deleteData, loadData } from "../../config/api";
import { coverDate, exportToExcel, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { employee, filter, kehadiran, list, reload } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import SearchableSelect from "../../component/select2";

const Unattendance = ({setIsLoading}) => {
    const navigate = useNavigate();

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
            sisaCuti: '12 hari',
            pengajuan: '03/01/2025',
            mulai: '03/01/2025',
            sampai: '03/01/2025',
            Durasi: '1 hari',
            alasanKetidakharidan : '-',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            sisaCuti: '12 hari',
            pengajuan: '03/01/2025',
            mulai: '03/01/2025',
            sampai: '03/01/2025',
            Durasi: '1 hari',
            alasanKetidakharidan : '-',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            sisaCuti: '12 hari',
            pengajuan: '03/01/2025',
            mulai: '03/01/2025',
            sampai: '03/01/2025',
            Durasi: '1 hari',
            alasanKetidakharidan : '-',
            Status: 'Pending',
        },
        {
            name: 'Sample Employee',
            nik: '123456789012',
            sisaCuti: '12 hari',
            pengajuan: '03/01/2025',
            mulai: '03/01/2025',
            sampai: '03/01/2025',
            Durasi: '1 hari',
            alasanKetidakharidan : '-',
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

    const renderFormModal = () => {
        return (
            <Modal isOpen={isModalOpen} onClose={closeModal} setWidth='60%'>
                <div className="relative bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{'Data Ketidakhadiran'}</p>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalOpen(false)}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="flex flex-row flex-wrap w-full pt-2">
                        <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} setPosition={'bottom'} label={'Karyawan'} placeHolder={'Pilih Karyawan'} setWidth="48%" options={listEmployee} value={null} />
                        <div className="mx-2" />
                        <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={listType} value={null} />

                        <Input textAlign={'left'} handleAction={handleChange} label={'Start Date'} setName={'hks'} setWidth="48%" value={null} type={'date'} />
                        <div className="mx-2" />
                        <Input textAlign={'left'} handleAction={handleChange} label={'End Date'} setName={'hka'} setWidth="48%" value={null} type={'date'} />

                        <Input textAlign={'left'} handleAction={handleChange} label={'Sisa Cuti'} setName={'hks'} setWidth="48%" value={null} />
                        <div className="mx-2" />
                        <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Hari'} setName={'hka'} setWidth="48%" value={null} />

                        <Input handleAction={handleChange} label={'Alasan'} setName={''} placeholder={'isi alasan'} content="textarea" />
                        <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} setPosition={'bottom'} label={'Status'} placeHolder={'Pilih Status'} setWidth="48%" options={[{label: 'Approve', value: 'Approve'}, {label: 'Reject', value: 'Reject'}]} value={null} />
                        
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="flex flex-row justify-between w-full">
                        <div className="flex flex-row py-2 items-center cursor-pointer">
                            <input type="checkbox"  />
                            <label className="text-xs pl-2">{'Data Sudah Benar'}</label>
                        </div>
                        <div className="flex flex-row">
                            <Button text="Close" setWidth={'full'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => closeModal()} />
                            <div className="mx-1" />
                            <Button text="Submit" setWidth={'full'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => closeModal()} />
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    return (
        <>
            <TitlePage label={'Data Ketidakhadiran'} source={list} isAction={true} handleAdd={() => {setModalOpen(true)}}/>
            <div>

                {!isLoadData ? 
                    <Table dataTable={sampleData}  />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
            {renderFormModal()}
        </>
    );
}

export default Unattendance;