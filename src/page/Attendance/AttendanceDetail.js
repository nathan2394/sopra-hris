import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { useAPI } from "../../config/fetchApi";
import { coverDate, exportToExcel, formatText, getCurrentDate, getQueryParam } from "../../config/helper";
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
import DataTable from "../../component/dataTable";
import InputContent from "../../component/sections/inputContent";
import MyDatePicker from "../../component/date_picker";
import FormShift from "../../component/sections/formShift";
import FormUnattendance from "../../component/sections/formUnattendance";
import FormOvertime from "../../component/sections/formOvertime";
import NavigateFooter from "../../component/navigateFooter";

const AttendanceDetail = ({setIsLoading}) => {
    const { deleteData, loadData } = useAPI();
    const navigate = useNavigate();
    const getId = getQueryParam("employeeId");
    const localSetPeriod = JSON.parse(localStorage?.getItem('setPeriod'));
    const [rowActive, setRowActive] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showContent, setShowContent] = useState('Shift');

    const [isSubmit, setIsSubmit] = useState(false);
    const [listData, setListData] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [listType, setListType] = useState([]);
    const [listUnattendanceType, setUnattendanceType] = useState([]);
    const [reasonType, setReasonType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);
    const [attendanceLog, setAttendanceLog] = useState([]);

    const [formData, setFormData] = useState({
        attendanceID: 0,
        employeeID: 0,
        clockIn: "",
        description: "",
        unattendanceTypeID: 0
    });

    const [attendanceData, setAttendanceData] = useState({
        date: '',
        shiftName: ''
    })

    const [unattendanceDetail, setUnattendanceDetail] = useState({
        employeeID: 0,
        unattendanceTypeID: 0
    })


    const [shiftDetail, setShiftDetail] = useState({
        employeeID: getId,
        date: '',
        clockIn: null,
        clockOut: null,
        clockInWeekend: null,
        clockOutWeekend: null,
        shiftName: '',
        attendanceID: '',
    })

    const [employeeName, setEmployeeName] = useState(null);

    useEffect(() => {
        loadData({url: 'UnattendanceTypes'}).then((res) => {
            setUnattendanceType(res?.data?.map((obj) => ({
                value: obj?.code,
                label: obj?.name
            })))
        })

        loadData({url: 'Reasons'}).then((res) => {
            setReasonType(res?.data?.map((obj) => ({
                value: obj?.reasonID,
                label: obj?.name
            })))
        })

    }, []);

    useEffect(() => {
        loadData({url: `Employees/${getId}`})?.then((res) => {
            setEmployeeName(res?.data?.employeeName || null)
        });
        fetchDetailAttendance();
    }, [getId])

    useEffect(() =>{
        if(attendanceData?.date){
            fetchAttendanceLog();
        }
    }, [attendanceData?.date, attendanceData?.shiftName])

    const fetchDetailAttendance = () => {
        setIsLoading(true);
        setShowForm(false);
        loadData({url: `Attendances/DetailAttendance/${getId}/${localSetPeriod?.startDate}|${localSetPeriod?.endDate}`}).then((res) => {
            const filteredData = res?.data?.map((obj, idx) => {
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
                    id: idx+1,
                    ...filteredObj,
                };
            }).sort((a, b) => new Date(b.transDate) - new Date(a.transDate)); // Sort by transdace descending
            setListData(filteredData);
            setIsLoading(false);
        })
    }

    const fetchAttendanceLog = useCallback(() => {
        loadData({url: 'Shifts', params: [{title: 'filter', value: `name:${attendanceData?.shiftName}`}]})?.then((res) => {
            if(res?.data?.length > 0){
                const data = res?.data[0];
                setShiftDetail({
                    employeeID: getId,
                    clockIn: data?.startTime || null,
                    clockOut: data?.endTime || null,
                    clockInWeekend: data?.weekendStartTime ?? null,
                    clockOutWeekend: data?.weekendEndTime ?? null,
                    shiftName: data?.name
                })
            }
        })

        loadData({url: `Attendances/ListAttendance/${getId}/${coverDate(attendanceData?.date, 'input')}`})?.then((res) => {
            setAttendanceLog(res?.data?.sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn)));
        })
    })

    const handleAfterExecute = useCallback((targetId) => {
        if(targetId){
            navigate(`/attendance/detail?employeeId=${targetId}`);
        }
    }, [navigate]);

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
        setAttendanceData({
            ...formData,
            [target]: value,
          });
    }

    const handleAdd = () => {
        setShowForm(false);
    }

    const handleClick = (data) => {
        const target = listData?.find((obj) => obj?.id === data?.id);
        setShowContent(target?.unattendance ? 'Unattendance' : 'Shift');
        setAttendanceData({
            date: target?.transDate,
            shiftName: target?.shiftName
        });
        setUnattendanceDetail({employeeID: getId, unattendanceTypeID: target?.unattendance })
        setRowActive(data?.id);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    const renderFormModal = () => {
        return (
            <Modal isOpen={isModalOpen} onClose={closeModal} setWidth='60%'>
                <div className="relative bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{'Edit Kehadiran'}</p>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalOpen(false)}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="flex flex-row flex-wrap w-full pt-2">
                        <Input textAlign="left" handleAction={handleChange} label={'Tanggal'} setWidth="48%" value={null} type={'date'} />
                        <div className="mx-2" />
                        <SearchableSelect handleAction={handleChangeSelect} setPosition={'bottom'} label={'Shift'} placeHolder={'Pilih Shift'} setWidth="48%" options={[{label: 'Pagi', value: 'pagi'}]} value={null} />

                        <Input textAlign="left" handleAction={handleChange} label={'Jam Masuk'} setWidth="48%" value={null} type={'time'} />
                        <div className="mx-2" />
                        <Input textAlign="left" handleAction={handleChange} label={'Jam Keluar'} setWidth="48%" value={null} type={'time'} />

                        <Input textAlign="left" handleAction={handleChange} label={'Overtime (Dari)'} setWidth="48%" value={null} type={'time'} />
                        <div className="mx-2" />
                        <Input textAlign="left" handleAction={handleChange} label={'Overtime (Sampai)'} setWidth="48%" value={null} type={'time'} />
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="flex flex-row justify-between w-full">
                        <div className="flex flex-row py-2 items-center cursor-pointer">
                            <input type="checkbox"  />
                            <label className="text-xs pl-2">{'Data Sudah Benar'}</label>
                        </div>
                        <div className="flex flex-row">
                            <Button text="Batal" setWidth={'100px'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} setPadding="6px" handleAction={() => closeModal()} />
                            <div className="mx-1" />
                            <Button text="Simpan" setWidth={'100px'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} setPadding="6px" handleAction={() => closeModal()} />
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    const setColumns = [
        { field: "tanggal", header: "Tanggal", alignment: "center", render: (_, row) => `${coverDate(row.transDate)}` },
        { field: "shiftName", header: "Shift", alignment: "left"},
        { field: "actualStartTime", header: "Sistem Masuk", alignment: "center", render: (value) => `${coverDate(value, 'time')}` },
        { field: "actualEndTime", header: "Sistem Keluar", alignment: "center", render: (value) => `${coverDate(value, 'time')}` },
        { field: "late", header: "Terlambat", alignment: 'center' },
        { field: "ovt", header: "Lembur", alignment: 'center' },
        { field: "unattendance", header: "Keterangan", alignment: 'center', color: '#D22F27'},
        { field: "effectiveHours", header: "Jam Kerja Efektif", alignment: 'center' }
    ]

    return (
        <>
            <TitlePage label={'Kehadiran'} subLabel={employeeName || "Nama Karyawan"} source={kehadiran} type="detail" setNavigateBack={'/attendance'} isAction={true} />
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between pb-8">
                        {/* <Table dataTable={listData} rowSettings={rowSettings} setWidth={'85%'} actionClick={handleClick} /> */}
                        <DataTable dataTable={listData} columns={setColumns} setWidth={'75%'} actionClick={handleClick} rowActive={rowActive} />
                        <div className="mx-2" />
                        <div className="flex flex-col w-[40%]">
                            <div className="w-full flex flex-row items-center mb-3">
                                <Button text="Shift" bgcolor={showContent === 'Shift' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => setShowContent('Shift')} />
                                <div className="mx-1" />
                                <Button text="Ketidakhadiran" bgcolor={showContent === 'Unattendance' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => setShowContent('Unattendance')} />
                                <div className="mx-1" />
                                <Button text="Lembur" bgcolor={showContent === 'Overtime' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => setShowContent('Overtime')} />
                            </div>
                            {showContent === 'Shift' && <FormShift showForm={showForm} setWidth={'auto'} dataObj={shiftDetail} targetDate={attendanceData?.date} listLog={attendanceLog} /> }
                            {showContent === 'Unattendance' && <FormUnattendance showForm={true} setWidth={'auto'} dataObj={unattendanceDetail} targetDate={attendanceData?.date} listType={listUnattendanceType} /> }
                            {showContent === 'Overtime' && <FormOvertime showForm={true} setWidth={'auto'} targetDate={attendanceData?.date} listType={reasonType}/> }
                        </div>
                    </div>
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
                <NavigateFooter navRoute={`/attendance/detail?employeeId=`} currId={getId} handleAction={handleAfterExecute} />
            </div>
            {renderFormModal()}
        </>
    );
}

export default AttendanceDetail;