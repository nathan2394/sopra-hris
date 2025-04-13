import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { convertDate, formatText } from "../../../config/helper";
import { baseColor } from "../../../config/setting";
import Button from "../../button";
import { add } from "../../../config/icon";
import { useAPI } from "../../../config/fetchApi";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../select2";

const FormShift = ({dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listShift = [], showLogs = true, listLog = [], targetDate = null, showForm = false, setWidth = '100%', handleChange, btnApprove = false, btnCancel = false, btnAction = true, handleAfterExecute, inputLock = false, btnAdd = false }) => {
    const navigate = useNavigate();
    const { loadData, postData, updateData } = useAPI();

    const userData = JSON.parse(localStorage.getItem('userdata'));

    const [targetClockIn, setTargetClockIn] = useState(null);
    const [targetClockOut, setTargetClockOut] = useState(null);

    const [editLog, setEditLog] = useState(false)

    const [shiftDetail, setShiftDetail] = useState({
        employeeID: dataObj?.employeeID,
        shiftID: 0,
        transDate: null,
        clockIn: null
    })

    // const handleChange = (event) => {
    //     // setFormData({
    //     //   ...formData,
    //     //   [event.target.name]: event.target.value,
    //     // });
    // };

    function adjustTime(timeStr, difHour) {
        if(timeStr && difHour !== null){
            const [hours, minutes, seconds] = timeStr?.split(":")?.map(Number);
            
            // Create a date object with today's date and given time
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
    
            // Adjust the hour
            date.setHours(date.getHours() + parseInt(difHour));
          
            // Format it back to HH:MM:SS
            const pad = (num) => String(num).padStart(2, "0");
            const newTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
          
            return newTime;
        }
    }
      

    useEffect(() => {
        if(dataObj?.shiftFromID === dataObj?.shiftToID){
            let startTime = adjustTime(dataObj?.clockIn, dataObj?.hourDiff);
            let endTime = adjustTime(dataObj?.clockOut, dataObj?.hourDiff);
            setTargetClockIn(startTime);
            setTargetClockOut(endTime);
        }else{
            let shiftData = listShift?.find(obj => obj?.value === dataObj?.shiftToID);
            setTargetClockIn(shiftData?.clockIn);
            setTargetClockOut(shiftData?.clockOut);
        }
    }, [dataObj?.shiftToID, dataObj?.hourDiff])

    const handleSubmitLog = () => {
        let obj = {
            employeeID: dataObj?.employeeID,
            clockIn: convertDate(targetDate, 'input') + ' ' + convertDate(dataObj?.clockIn, 'time'),
            description: `Manual By ${userData?.roleName || '-'}`
        }

        postData({url: 'Attendances', formData: obj})?.then((res) => {
            navigate(0);
        })
    }

    const handleSubmit = () => {
        const requestData = {
            "employeeID": dataObj?.employeeID,
            "shiftFromID": dataObj?.shiftFromID,
            "shiftToID": dataObj?.shiftFromID,
            "transDate": dataObj?.transDate,
            "hourDiff": dataObj?.hourDiff,
            "remarks": "",
        }

        postData({url: 'EmployeeTransferShifts', formData: requestData})?.then((res) => {
            if(handleAfterExecute){
                handleAfterExecute();
            }else{
                navigate(0);
            }
        })
    }

    const handleApproveReject = (val) => {
        const isApproved = val;
        const requestData = [];
        if(isApproved === true || isApproved === false){
            const request = {
                id: dataObj?.id,
                isApproved1: isApproved,
                isApproved2: isApproved
            }

            requestData?.push(request)

            postData({url: 'EmployeeTransferShifts/Approval', formData: requestData})?.then((res) => {
                if(handleAfterExecute){
                    handleAfterExecute();
                }else{
                    navigate(0);
                }
            })
        }
    }

    const handleCancel = () => {}

    return (
        <InputContent showForm={showForm} setWidth={setWidth} isAdd={isAdd} setIsAdd={setIsAdd} btnLabel="Tukar Shift" isEdit={isEdit} setIsEdit={setIsEdit} handleAction={handleSubmit} handleApproveReject={handleApproveReject} handleCancel={handleCancel} showBtnApprove={btnApprove} showBtnCancel={btnCancel} showBtnAction={btnAction} showBtnAdd={btnAdd}> 
            <div className="flex flex-row flex-wrap w-full">
                <MyDatePicker label={'Tanggal'} placeholder="Pilih Tanggal" setWidth="48%" value={targetDate ? targetDate : dataObj?.transDate} readOnly={true} />
                <div className="mx-2" />
                <SearchableSelect handleAction={handleChange} name={`shiftFromID`} setPosition={'bottom'} label={'Nama Shift'} setWidth="48%" options={listShift} value={dataObj?.shiftFromID} isDisabled={inputLock} />
                <MyDatePicker label={'Jam Masuk'} placeholder="Pilih Jam" setWidth="48%" value={dataObj?.clockIn} isTimeOnly={true} readOnly={true} />
                <div className="mx-2" />
                <MyDatePicker label={'Jam Keluar'} placeholder="Pilih Jam" setWidth="48%" value={dataObj?.clockOut} isTimeOnly={true} readOnly={true} />
            </div>
            <div className="bg-[#ddd] mb-4 h-[1.5px]" />
            {(isAdd || isEdit) ?
            <div className="flex flex-row flex-wrap w-full">
                <SearchableSelect handleAction={handleChange} name={`shiftToID`} setPosition={'bottom'} label={'Shift Tujuan'} setWidth="48%" options={listShift} value={dataObj?.shiftToID} isDisabled={inputLock} />
                <div className="mx-2" />
                <Input textAlign={'left'} handleAction={handleChange} label={'Pergeresan Durasi'} setName={'hourDiff'} setWidth="48%" value={dataObj?.shiftFromID === dataObj?.shiftToID ? dataObj?.hourDiff : 0} type={'number'} readOnly={inputLock ? inputLock : dataObj?.shiftFromID !== dataObj?.shiftToID} showBtnNum={dataObj?.shiftFromID === dataObj?.shiftToID} />
                <MyDatePicker label={'Jam Masuk'} placeholder="Pilih Jam" setWidth="48%" value={targetClockIn} isTimeOnly={true} readOnly={true} />
                <div className="mx-2" />
                <MyDatePicker label={'Jam Keluar'} placeholder="Pilih Jam" setWidth="48%" value={targetClockOut} isTimeOnly={true} readOnly={true} />
            </div>
            :
            <>
            {showLogs &&
                <div className="w-full">
                    <div className="flex flex-row items-center justify-between">
                        <p className="text-xs">Scan Log</p>
                        <p className={`text-xs text-[${editLog ? '#D22F27' : baseColor}] underline cursor-pointer`} onClick={() => setEditLog(!editLog)}>
                            {editLog ? "Batal" : "Tambah Scan Log"}
                        </p> 
                    </div>
                    <div className={`h-[180px] overflow-y-visible border border-[#d1d1d1] bg-[#f0f0f0] rounded-md mt-2`}>
                        {listLog?.length > 0 ? 
                            <div className="flex flex-col w-full">
                                {listLog?.map((obj, idx) => (
                                    <div className={`flex flex-row justify-center items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] text-xs p-1`}>
                                        <div className="w-[120px] text-center p-1">{formatText(obj?.clockIn)}</div>
                                        <div className="w-[120px] text-center">{convertDate(obj?.clockIn, 'time')}</div>
                                        <div className="w-[150px] text-left">{obj?.description || 'Sistem'}</div>
                                    </div>
                                ))}
                                {(editLog) && 
                                    <div className={`flex flex-row justify-center items-center bg-white border-b border-[#d1d1d1] text-xs p-2`}>
                                        <MyDatePicker name={'transDate'} handleAction={handleChange} placeholder="Pilih Tanggal" setWidth="45%" value={targetDate ? targetDate : shiftDetail?.transDate} readOnly={true}/>
                                        <div className="mx-1" />
                                        <MyDatePicker name={'clockIn'} handleAction={handleChange} placeholder="Pilih Jam" setWidth="45%" value={shiftDetail?.clockIn} isTimeOnly={true} />
                                        <div className="mx-1" />
                                        <Button bgcolor={baseColor} setWidth="auto" icon={add} position="center" handleAction={handleSubmitLog} />
                                    </div>
                                }
                            </div>
                            :
                            <div className="m-auto mt-16">
                                <p className="text-center text-xs text-gray-400">Tidak ada Lampiran</p>
                            </div>
                        }
                    </div>
                </div>
            }
            </>
            }
        </InputContent>
    )
}

export default FormShift;