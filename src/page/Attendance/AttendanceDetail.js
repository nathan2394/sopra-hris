import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { useAPI } from "../../config/fetchApi";
import { convertDate, getQueryParam } from "../../config/helper";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { kehadiran } from "../../config/icon";
import LoadingIndicator from "../../component/loading_indicator";
import DataTable from "../../component/dataTable";
import FormShift from "../../component/sections/formShift";
import FormUnattendance from "../../component/sections/formUnattendance";
import FormOvertime from "../../component/sections/formOvertime";
import NavigateFooter from "../../component/navigateFooter";

const AttendanceDetail = ({setIsLoading}) => {
    const { loadData } = useAPI();
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userdata'));
    const getId = getQueryParam("employeeId");
    const localSetPeriod = JSON.parse(localStorage?.getItem('setPeriod'));
    const [rowActive, setRowActive] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showContent, setShowContent] = useState('Shift');

    const [listData, setListData] = useState([]);
    const [listUnattendanceType, setUnattendanceType] = useState([]);
    const [listShift, setListShift] = useState([
        {
            value: 0,
            label: 'OFF',
            clockIn: "00:00:00",
            clockOut: "00:00:00",
        }
    ]);

    const [listUnattendance, setListUnattendance] = useState([]);
    const [listOvertime, setListOvertime] = useState([]);

    const [reasonType, setReasonType] = useState([]);
    const [isLoadData, setIsLoadData] = useState(false);
    const [attendanceLog, setAttendanceLog] = useState([]);

    const [btnAction, setBtnAction] = useState(false);
    const [btnCancel, setBtnCancel] = useState(false);
    const [inputLock] = useState(false);

    const [formData, setFormData] = useState({
        attendanceID: 0,
        employeeID: 0,
        transDate: "",
        clockIn: "",
        description: "",
        unattendanceTypeID: 0
    });

    const [attendanceData, setAttendanceData] = useState({
        date: new Date()
    })

    const [employeeName, setEmployeeName] = useState(null);

    useEffect(() => {
        loadData({url: 'UnattendanceTypes'}).then((res) => {
            setUnattendanceType(res?.data?.map((obj) => ({
                value: obj?.unattendanceTypeID,
                label: obj?.name
            })))
        })

        loadData({url: 'Reasons'}).then((res) => {
            setReasonType(res?.data?.map((obj) => ({
                value: obj?.reasonID,
                label: obj?.name
            })))
        })

        loadData({url: 'Shifts'})?.then((res) => {
            if(res?.data?.length > 0){
                const updatedShifts = res?.data?.map((data) => ({
                    value: data?.shiftID,
                    label: data?.code,
                    clockIn: data?.startTime || null,
                    clockOut: data?.endTime || null,
                }));
                setListShift([{ value: 0, label: 'OFF', clockIn: "00:00:00", clockOut: "00:00:00" }, ...updatedShifts]);
            }
        });

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
        // setShowForm(false);
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
        loadData({url: `Attendances/ListAttendance/${getId}/${convertDate(attendanceData?.date, 'input')}`})?.then((res) => {
            setAttendanceLog(res?.data?.sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn)));
        })
    })

    const fetchUnattendance = () => {
        if(localSetPeriod)
        loadData({url: 'Unattendances', params:[{title: 'date', value: `${localSetPeriod?.startDate}|${localSetPeriod?.endDate}`}, {title: 'filter', value: `name:${employeeName}`}]}).then((res) => {  
            const filteredData = res?.data.map(obj => {
                return {
                    id: obj?.unattendanceID,
                    employeeID: obj?.employeeID,
                    voucherNo: obj?.voucherNo,
                    transDate: obj?.transDate,
                    startDate: obj?.startDate,
                    unattendanceTypeID: obj?.unattendanceTypeID,
                    isApproved1: obj?.isApproved1,
                    isApproved2: obj?.isApproved2,
                    approvedBy1: obj?.approvedBy1,
                    approvedBy2: obj?.approvedBy1,
                    description: obj?.description,
                    endDate: obj?.endDate
                };
            });
            setListUnattendance(filteredData);
        });
    }

    const fetchOvertime = () => {
        if(localSetPeriod)
        loadData({url: 'Overtimes', params:[{title: 'date', value: `${localSetPeriod?.startDate}|${localSetPeriod?.endDate}`}, {title: 'search', value: `${employeeName}`}]}).then((res) => {  
            const filteredData = res?.data.map(obj => {
                return {
                    id: obj?.overtimeID,
                    employeeID: obj?.employeeID,
                    voucherNo: obj?.voucherNo,
                    transDate: obj?.transDate,
                    startDate: obj?.startDate,
                    endDate: obj?.endDate,
                    reasonID: obj?.reasonID,
                    description: obj?.description,
                    isApproved1: obj?.isApproved1, 
                    isApproved2: obj?.isApproved2
                };
            });
            setListOvertime(filteredData);
        });
    }

    const handleActionAfterExecute = () => {
        fetchDetailAttendance();
        setIsAdd(false);
        setIsEdit(false);
        setBtnAction(true);
        setBtnCancel(false);
        if(showContent ==='Shift') setShowForm(false);
        if(showContent ==='Overtime') fetchOvertime();
        if(showContent ==='Unattendance') fetchUnattendance();
    }

    const handleAfterExecute = useCallback((targetId) => {
        if(targetId){
            navigate(`/attendance/detail?employeeId=${targetId}`);
        }
    }, [navigate]);


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

    const handleViewOvt = (id, listData) => {
        const target = listData?.find((obj) => obj?.id === id);
        setIsEdit(true);
    }

    const handleClick = (data) => {
        const target = listData?.find((obj) => obj?.id === data?.id);
        let shiftData = listShift?.find(obj => obj?.label === target?.shiftCode);
        setAttendanceData({
            date: target?.transDate
        });
        setFormData(prev => ({
            ...prev,
            employeeID: getId,
            transDate: data?.transDate,
            shiftFromID: shiftData?.value || 0,
            shiftToID: 0,
            hourDiff: 0,
            clockIn: shiftData?.value ? shiftData?.clockIn : "00:00:00",
            clockOut: shiftData?.value ? shiftData?.clockOut : "00:00:00",
            startDate: showContent !== 'Overtime' ? data?.transDate : (`${convertDate(data?.transDate, 'input')} ${shiftData?.clockOut || "00:00"}`),
            endDate: showContent !== 'Overtime' ? data?.transDate : (`${convertDate(data?.transDate, 'input')} ${shiftData?.clockOut || "00:00"}`),
        }));
        setRowActive(data?.id);
        
        if(showContent ==='Shift'){
            setShowForm(true);
        } 
        setBtnAction(true);
    }

    const actionOpenDetail = (obj, target) => {
        console.log(obj)
        setFormData({
            id: obj?.id,
            employeeID: obj?.employeeID,
            duration: obj?.duration,
            transDate: obj?.transDate,
            unattendanceTypeID: obj?.reasonID,
            reasonID: obj?.reasonID,
            startDate: showContent !== 'Overtime' ? obj?.startDate : (`${convertDate(obj?.startDate, 'input')} ${convertDate(obj?.startDate, 'time')}`),
            endDate: showContent !== 'Overtime' ? obj?.endDate : (`${convertDate(obj?.endDate, 'input')} ${convertDate(obj?.endDate, 'time')}`),
            description: obj?.description,
            isApproved1: obj?.isApproved1, 
            isApproved2: obj?.isApproved2,
        })
        setBtnCancel(obj?.isApproved1 && obj?.isApproved2 ? false : true);
        setShowForm(true);
        setIsEdit(true);
        // setInputLock(true);
        setBtnAction(false);
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
                                    setShowForm(false);
                                    setIsAdd(false);
                                    setIsEdit(false);
                                    setRowActive(0);
                                    setFormData(prev => ({
                                        ...prev,
                                        employeeID: getId,
                                        startDate: null,
                                        endDate: null
                                    }))
                                }} />
                                <div className="mx-1" />
                                <Button text="Ketidakhadiran" bgcolor={showContent === 'Unattendance' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => {
                                    setShowContent('Unattendance');
                                    setIsAdd(false);
                                    setIsEdit(false);
                                    setBtnAction(true);
                                    setBtnCancel(false);
                                    fetchUnattendance();
                                    setRowActive(0);
                                    setFormData(prev => ({
                                        ...prev,
                                        employeeID: getId,
                                        startDate: null,
                                        endDate: null
                                    }))
                                }} />
                                <div className="mx-1" />
                                <Button text="Lembur" bgcolor={showContent === 'Overtime' ? baseColor : '#9d9d9d'} color={'white'} handleAction={() => {
                                    setShowContent('Overtime');
                                    setIsAdd(false);
                                    setIsEdit(false);
                                    setBtnAction(true);
                                    setBtnCancel(false);
                                    fetchOvertime();
                                    setRowActive(0);
                                    setFormData(prev => ({
                                        ...prev,
                                        employeeID: getId,
                                        startDate: null,
                                        endDate: null
                                    }))
                                }} />
                            </div>
                            {showContent === 'Shift' && <FormShift userData={userData} showForm={showForm} setWidth={'auto'} dataObj={formData} targetDate={attendanceData?.date} listLog={attendanceLog} listShift={listShift} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnAdd={true} btnAction={btnAction} setBtnAction={setBtnAction} btnCancel={btnCancel} inputLock={inputLock} handleAfterExecute={handleActionAfterExecute} /> }
                            {showContent === 'Unattendance' && <FormUnattendance userData={userData} listData={listUnattendance} showForm={true} setWidth={'auto'} dataObj={formData} targetDate={attendanceData?.date} listType={listUnattendanceType} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnAdd={true} actionOpenDetail={actionOpenDetail} btnAction={btnAction} setBtnAction={setBtnAction} btnCancel={btnCancel} setBtnCancel={setBtnCancel} inputLock={inputLock} handleAfterExecute={handleActionAfterExecute} /> }
                            {showContent === 'Overtime' && <FormOvertime userData={userData} listData={listOvertime} showForm={true} setWidth={'auto'} dataObj={formData} targetDate={attendanceData?.date} listType={reasonType} handleChange={handleChange} handleChangeSelect={handleChangeSelect} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} handleView={handleViewOvt} btnAdd={true} actionOpenDetail={actionOpenDetail} btnAction={btnAction} setBtnAction={setBtnAction} btnCancel={btnCancel} setBtnCancel={setBtnCancel} inputLock={inputLock} handleAfterExecute={handleActionAfterExecute} /> }
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