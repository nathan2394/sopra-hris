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
    const [isLoadData, setIsLoadData] = useState(false);
    const [attendanceLog, setAttendanceLog] = useState([]);

    const [formData, setFormData] = useState({
        attendanceID: 0,
        employeeID: 0,
        clockIn: "",
        description: ""
    });

    const [formShift, setFormShift] = useState({
        date: '',
        clockOut: '',
        shiftName: ''
    })

    const [shiftDetail, setShiftDetail] = useState({
        date: '',
        clockIn: null,
        clockOut: null,
        clockInWeekend: null,
        clockOutWeekend: null,
        shiftName: ''
    })

    useEffect(() => {
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
            
        })

    }, []);

    useEffect(() =>{
        if(formShift?.date){
            fetchAttendanceLog();
        }
    }, [formShift?.date, formShift?.shiftName])

    const fetchAttendanceLog = useCallback(() => {
        loadData({url: 'Shifts', params: [{title: 'filter', value: `name:${formShift?.shiftName}`}]})?.then((res) => {
            if(res?.data?.length > 0){
                const data = res?.data[0];
                setShiftDetail({
                    clockIn: data?.startTime || null,
                    clockOut: data?.endTime || null,
                    clockInWeekend: data?.weekendStartTime ?? null,
                    clockOutWeekend: data?.weekendEndTime ?? null,
                    shiftName: data?.name
                })
            }
        })

        loadData({url: `Attendances/ListAttendance/${getId}/${coverDate(formShift?.date, 'input')}`})?.then((res) => {
            setAttendanceLog(res?.data?.sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn)));
        })
    })

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
        setFormShift({
            ...formData,
            [target]: value,
          });
    }

    const handleAdd = () => {
        setShowForm(false);
    }

    const handleClick = (data) => {
        setShowContent('Shift');
        const attendanceData = listData?.find((obj) => obj?.id === data?.id);
        setFormShift({
            date: attendanceData?.transDate,
            clockIn: attendanceData?.actualStartTime,
            clockOut: attendanceData?.actualEndTime,
            shiftName: attendanceData?.shiftName
        })
        setRowActive(attendanceData?.id);
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
            <TitlePage label={'Kehadiran'} subLabel="Nama Karyawan" source={kehadiran} type="detail" setNavigateBack={'/attendance'} isAction={true} />
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        {/* <Table dataTable={listData} rowSettings={rowSettings} setWidth={'85%'} actionClick={handleClick} /> */}
                        <DataTable dataTable={listData} columns={setColumns} setWidth={'85%'} actionClick={handleClick} rowActive={rowActive} />
                        <div className="mx-2" />
                        <InputContent showForm={showForm} buttonHeader={true} showContent={showContent} setShowContent={setShowContent}>
                            {showContent === 'Shift' && <>
                                <div>
                                    <div className="flex flex-row flex-wrap w-full">
                                        <MyDatePicker label={'Tanggal'} placeholder="Pilih Tanggal" setWidth="48%" value={formShift?.date} readOnly={true} />
                                        <div className="mx-2" />
                                        <Input textAlign={'left'} handleAction={handleChange} label={'Nama Shift'} setName={'endDate'} setWidth="48%" value={shiftDetail?.shiftName} type={'input'} />
                                        {/* <Input textAlign={'left'} handleAction={handleChange} label={'Jam Masuk'} setWidth="48%" value={'08.00'} readOnly={true} type={'time'} /> */}
                                        <MyDatePicker label={'Jam Masuk'} placeholder="Pilih Jam" setWidth="48%" value={shiftDetail?.clockIn} isTimeOnly={true} />
                                        <div className="mx-2" />
                                        <MyDatePicker label={'Jam Keluar'} placeholder="Pilih Jam" setWidth="48%" value={shiftDetail?.clockOut} isTimeOnly={true} />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex flex-row items-center justify-between">
                                            <p className="text-xs">Scan Log</p>
                                        </div>
                                        <div className={`h-[180px] overflow-y-auto border border-[#ebebeb] rounded-md mt-2`}>
                                            {attendanceLog?.length > 0 ? 
                                                <div className="flex flex-col w-full">
                                                    {attendanceLog?.map((obj, idx) => (
                                                        <div className={`flex flex-row justify-center items-center ${idx%2 === 0 ? 'bg-[#ebebeb]' : 'bg-white'} text-xs p-1`}>
                                                            <div className="w-[120px] text-center">{formatText(obj?.clockIn)}</div>
                                                            <div className="w-[120px] text-center">{coverDate(obj?.clockIn, 'time')}</div>
                                                            <div className="w-[150px] text-left">{obj?.description || 'Sistem'}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                :
                                                <div className="m-auto mt-16">
                                                    <p className="text-center text-xs text-gray-400">Tidak ada Lampiran</p>
                                                </div>
                                            }
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
                            </>}
                            {showContent === 'Unnatendance' && <>
                                <div>
                                    <div className="flex flex-row flex-wrap w-full">
                                        <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={formData?.startDate} type={'date'} />
                                        <div className="mx-2" />
                                        <Input textAlign={'left'} handleAction={handleChange} label={'Sampai Tanggal'} setName={'endDate'} setWidth="48%" value={formData?.endDate} type={'date'} />
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
                            </>}
                            {showContent === 'Overtime' && <>
                                <div>
                                    <div className="flex flex-row flex-wrap w-full">
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
                            </>}
                        </InputContent>
                    </div>
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

export default AttendanceDetail;