import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { convertDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import IconImage from "../../icon_img";
import { add_g, approve, empty, pending, reject } from "../../../config/icon";
import { useAPI } from "../../../config/fetchApi";
import { useNavigate } from "react-router-dom";
import { baseColor } from "../../../config/setting";

const FormUnattendance = ({dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listType = [], listData = [], listEmployee, targetDate = null, showForm = false, setWidth = '100%', handleChange, btnCancel = false, btnAction = true, setBtnAction, btnApprove = false, handleAfterExecute, actionOpenDetail, inputLock = false, btnAdd = false}) => {
    const navigate = useNavigate();
    const [duration, setDuration] = useState(dataObj?.duration || 0);
    const { deleteData, loadData, postData } = useAPI();

    useEffect(() => {
        if(dataObj?.startDate && dataObj?.endDate){
            setDuration(Math.ceil((new Date(dataObj?.endDate) - new Date(dataObj?.startDate)) / (1000 * 60 * 60 * 24)));
        }
    }, [dataObj?.startDate, dataObj?.endDate]);



    const handleSubmit = () => {
        const requestData = {
            "employeeID": dataObj?.employeeID,
            "startDate": dataObj?.startDate,
            "endDate": dataObj?.endDate,
            "unattendanceTypeID": dataObj?.unattendanceTypeID,
            "description": dataObj?.description,
            "isApproved1": null,
            "isApproved2": null
        }

        postData({url: 'Unattendances', formData: requestData})?.then((res) => {
            // console.log(res);
            navigate(0);
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

            requestData?.push(request);

            postData({url: 'Unattendances/Approval', formData: requestData})?.then((res) => {
                if(handleAfterExecute){
                    handleAfterExecute();
                }else{
                    navigate(0);
                }
            })
        }
    }

    const handleCancel = () => {
        deleteData({url: `Unattendances`, id: dataObj?.id})?.then((res) => {
            navigate(0);
        })
    }

    return (
        <InputContent showForm={showForm} handleAction={handleSubmit} handleApproveReject={handleApproveReject} isAdd={isAdd} setIsAdd={setIsAdd} isEdit={isEdit} setIsEdit={setIsEdit} setWidth={setWidth}  btnLabel="Tambah Data" showBtnApprove={btnApprove} showBtnAction={btnAction} setBtnAction={setBtnAction} showBtnCancel={btnCancel} handleCancel={handleCancel} showBtnAdd={btnAdd} showBtnBack={listData?.length > 0}> 
            {(isAdd || isEdit) ?
                <div className="flex flex-row flex-wrap w-full">
                    <>
                        {listEmployee && <SearchableSelect handleAction={handleChange} name={`employeeID`} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Pilih Karyawan'} setWidth="100%" options={listEmployee} value={dataObj?.employeeID} isDisabled={isEdit} /> }
                        <MyDatePicker handleAction={handleChange} label={'Mulai Tanggal'} placeholder="Pilih Tanggal" name={'startDate'} setWidth="48%" value={dataObj?.startDate}  readOnly={inputLock} />
                        <div className="mx-2" />
                        <MyDatePicker handleAction={handleChange} label={'Sampai Tanggal'} placeholder="Pilih Tanggal" name={'endDate'} setWidth="48%" value={dataObj?.endDate}  readOnly={inputLock} />
                        <Input label={'Durasi Hari'} placeholder={'Durasi Ketidakhadiran'} setWidth="48%" value={`${duration} Hari`} readOnly={true} />
                        <div className="mx-2" />
                        <SearchableSelect handleAction={handleChange} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={listType} value={dataObj?.unattendanceTypeID} isDisabled={inputLock} />
                    </>
                    <Input handleAction={handleChange} label={'Alasan'} subLabel={'(Opsional)'} setName={'description'} placeholder={'isi alasan'} content="textarea" value={dataObj?.description} readOnly={inputLock} />
                </div>
                :
                <>
                    {listData?.length > 0 && <div className="text-xs mb-1">{'Data Cuti & Ijin'}</div>}
                    {(!isAdd && !isEdit && listData?.length > 0) ? <>
                        <div className="flex flex-col w-full overflow-y-auto max-h-[400px] pt-1">
                            <div className={`flex flex-row justify-between items-center bg-[#f0f0f0] border border-[#d1d1d1] text-xs p-1`}>
                                <div className={`w-[90px] text-center p-1`}>No. SKT</div>
                                <div className="w-[200px] text-center p-1">Tgl Ketidakhadiran</div>
                                <div className="w-[40px] text-center">Status</div> 
                            </div>
                            {listData?.map((obj, idx) => (
                                <div className={`flex flex-row justify-between items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] hover:bg-[#379d0043] cursor-pointer text-xs p-1`} onClick={() => actionOpenDetail(obj, 'unattendance')}>
                                    <div className={`w-[90px] text-left text-[${baseColor}] underline p-1`}>{obj?.voucherNo}</div>
                                    <div className="w-[200px] text-center p-1">{`${convertDate(obj?.startDate)} - ${convertDate(obj?.endDate)}`}</div>
                                    <div className="w-[40px] flex justify-center"> 
                                        {obj?.isApproved1 && obj?.isApproved2 ? 
                                            <IconImage size="w-3" source={approve} /> 
                                            : (obj?.approvedBy1 === false && obj?.isApproved2 === false) && (obj?.approvedBy1 || obj?.approvedBy2) 
                                            ? <IconImage size="w-3" source={reject} /> 
                                            : <IconImage size="h-4" source={pending} />} 
                                    </div> 
                                </div>
                            ))}
                        </div>
                    </>
                    :
                    <>
                        <div className="h-[100px] flex flex-col items-center justify-center text-center">
                            <img className="w-[55%] mx-auto pt-[280px]" alt="logo" src={empty} />
                            <p className="font-bold text-sm">Ups, Tidak Ada Data!</p>
                        </div>
                    </>
                    }
                </>
            }
        </InputContent>
    )
}

export default FormUnattendance;