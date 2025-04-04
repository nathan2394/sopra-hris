import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { useAPI } from "../../config/fetchApi";
import { convertDate, exportToExcel, formatText, getCurrentDate, getQueryParam } from "../../config/helper";
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

    const [ovtDetail, setOvtDetail] = useState({
        employeeID: 0,
        transDate: "",
        startDate: "",
        endDate: "",
        reasonID: 0,
        description: "",
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

        loadData({url: `Attendances/ListAttendance/${getId}/${convertDate(attendanceData?.date, 'input')}`})?.then((res) => {
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
        console.log(event.target.name, event.target.value);
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

    const handleViewOvt = (id, listData) => {
        const target = listData?.find((obj) => obj?.id === id);
        setOvtDetail({
            employeeID: getId,
            transDate: "",
            startDate: target?.startDate,
            endDate: target?.endDate,
            reasonID: target?.reasonID,
            description: target?.description,
        });
        setIsEdit(true);
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
    }

    const setColumns = [
        { field: "tanggal", header: "Tanggal", alignment: "center", render: (_, row) => `${convertDate(row.transDate)}` },
        { field: "shiftCode", header: "Shift", alignment: "center"},
        { field: "actualStartTime", header: "Sistem Masuk", alignment: "center", render: (value) => `${convertDate(value, 'time')}` },
        { field: "actualEndTime", header: "Sistem Keluar", alignment: "center", render: (value) => `${convertDate(value, 'time')}` },
        { field: "earlyClockOut", header: "Pulang Cepat", alignment: 'center' },
        { field: "late", header: "Terlambat", alignment: 'center' },
        { field: "ovt", header: "Lembur", alignment: 'center' },
        { field: "unattendance", header: "Keterangan", alignment: 'center', color: '#D22F27'},
        { field: "effectiveHours", header: "Jam Kerja Efektif", alignment: 'center', render: (value) => `${Math?.round(value)}`}
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
                                <Button text="Shift" bgcolor={showContent === 'Shift' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => {
                                    setShowContent('Shift');
                                    setIsAdd(false);
                                    setIsEdit(false);
                                }} />
                                <div className="mx-1" />
                                <Button text="Ketidakhadiran" bgcolor={showContent === 'Unattendance' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => {
                                    setShowContent('Unattendance');
                                    setIsAdd(false);
                                    setIsEdit(false);
                                }} />
                                <div className="mx-1" />
                                <Button text="Lembur" bgcolor={showContent === 'Overtime' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => {
                                    setShowContent('Overtime');
                                    setIsAdd(false);
                                    setIsEdit(false);
                                }} />
                            </div>
                            {showContent === 'Shift' && <FormShift showForm={showForm} setWidth={'auto'} dataObj={shiftDetail} targetDate={attendanceData?.date} listLog={attendanceLog} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} /> }
                            {showContent === 'Unattendance' && <FormUnattendance showForm={true} setWidth={'auto'} dataObj={unattendanceDetail} targetDate={attendanceData?.date} listType={listUnattendanceType} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} /> }
                            {showContent === 'Overtime' && <FormOvertime showForm={true} setWidth={'auto'} dataObj={ovtDetail} targetDate={attendanceData?.date} listType={reasonType} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} handleView={handleViewOvt} /> }
                        </div>
                    </div>
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
                <NavigateFooter navRoute={`/attendance/detail?employeeId=`} currId={getId} handleAction={handleAfterExecute} />
            </div>
        </>
    );
}

export default AttendanceDetail;