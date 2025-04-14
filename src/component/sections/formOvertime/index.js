import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { convertDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import { useAPI } from "../../../config/fetchApi";
import { baseColor } from "../../../config/setting";
import { useNavigate } from "react-router-dom";
import { approve, empty, pending, reject } from "../../../config/icon";
import IconImage from "../../icon_img";

// const FormOvertime = ({dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listType = [], listEmployee = [], handleChange, handleChangeSelect, handleView, targetDate = null, showForm = false, setWidth = '100%', btnApprove = false, btnCancel = false, btnAction = true, handleAfterExecute, inputLock = false, btnAdd = false}) => {
const FormOvertime = ({userData, dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listType = [], listData = [], listEmployee, targetDate = null, showForm = false, setWidth = '100%', handleChange, btnCancel = false, setBtnCancel, btnAction = true, setBtnAction, btnApprove = false, handleAfterExecute, actionOpenDetail, inputLock = false, btnAdd = false}) => {
    const navigate = useNavigate();

    const [duration, setDuration] = useState(dataObj?.duration || 0);
    const { deleteData, postData, loadData, updateData } = useAPI();

    useEffect(() => {
        if(dataObj?.startDate && dataObj?.endDate){
            setDuration((new Date(dataObj?.endDate) - new Date(dataObj?.startDate)) / (1000 * 60 * 60));
        }
    }, [dataObj?.startDate, dataObj?.endDate])

    const handleSubmit = () => {
        const requestData = {
            "overtimeID": dataObj?.employeeID,
            "employeeID": dataObj?.employeeID,
            "transDate": dataObj?.transDate,
            "startDate": convertDate(dataObj?.transDate, 'input') + ' ' +  convertDate(dataObj?.startDate, 'time'),
            "endDate": convertDate(dataObj?.transDate, 'input') + ' ' +  convertDate(dataObj?.endDate, 'time'),
            "reasonID": dataObj?.reasonID,
            "description": dataObj?.description,
        }

        // console.log(requestData);
        postData({url: 'Overtimes', formData: requestData})?.then((res) => {
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

            postData({url: 'Overtimes/Approval', formData: requestData})?.then((res) => {
                if(handleAfterExecute){
                    handleAfterExecute();
                }else{
                    navigate(0);
                }
            })
        }
    }

    const handleCancel = () => {
        deleteData({url: `Overtimes`, id: dataObj?.id})?.then((res) => {
            if(handleAfterExecute){
                handleAfterExecute();
            }else{
                navigate(0);
            }
        })
    }

    return (
        <InputContent userData={userData} showForm={showForm} handleAction={handleSubmit} handleApproveReject={handleApproveReject} isAdd={isAdd} setIsAdd={setIsAdd} isEdit={isEdit} setIsEdit={setIsEdit} setWidth={setWidth}  btnLabel="Tambah Data Lembur" showBtnApprove={btnApprove} showBtnAction={btnAction} setBtnAction={setBtnAction} showBtnCancel={btnCancel} setBtnCancel={setBtnCancel} handleCancel={handleCancel} showBtnAdd={btnAdd} showBtnBack={listData?.length > 0}>
            {(isAdd || isEdit) ?          
                <div className="flex flex-row flex-wrap w-full">
                    {/* <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={null} type={'date'} /> */}
                    {listEmployee?.length > 0 && <>
                        <SearchableSelect handleAction={handleChange} name={`employeeID`} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Pilih Karyawan'} setWidth="48%" options={listEmployee} value={dataObj?.employeeID} isDisabled={isEdit} />
                        <div className="mx-2" />
                        <MyDatePicker handleAction={handleChange} label={'Tanggal Lembur'} name={'startDate'} setWidth="48%" value={dataObj?.startDate} readOnly={inputLock} />
                    </>}
                    <MyDatePicker handleAction={handleChange} label={'Lembur Dari'} setWidth="48%" name={'startDate'} value={dataObj?.startDate} isTimeOnly={true} readOnly={inputLock} />
                    <div className="mx-2" />
                    <MyDatePicker handleAction={handleChange} label={'Lembur Sampai'} setWidth="48%" name={'endDate'} value={dataObj?.endDate} isTimeOnly={true} readOnly={inputLock} />
                    <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Jam'} setWidth="48%" value={`${formatText(duration)} Jam`} readOnly={true} />
                    <div className="mx-2" />
                    <SearchableSelect handleAction={handleChange} name={`reasonID`} setPosition={'bottom'} label={'Keterangan Lembur'} placeHolder={'Keterangan Lembur'} setWidth="48%" options={listType} value={dataObj?.reasonID} isDisabled={inputLock} />
                    <Input handleAction={handleChange} label={'Notes'} setName={'description'} placeholder={'isi alasan'} content="textarea" value={dataObj?.description} readOnly={inputLock} />
                </div>
                :
                <>
                    {(!isEdit && listData?.length > 0) ?
                        <>
                        {listData?.length > 0 && <div className="text-xs mb-1">{'Data Lembur'}</div>}
                        <div className="flex flex-col w-full">
                            <div className={`flex flex-row justify-between items-center bg-[#f0f0f0] border border-[#d1d1d1] text-xs p-1`}>
                                <div className={`w-[90px] text-center p-1`}>No. SPL</div>
                                <div className="w-[130px] text-center p-1">Lembur Dari</div>
                                <div className="w-[130px] text-center p-1">Lembur Sampai</div>
                                <div className="w-[40px] text-center">Status</div> 
                            </div>
                            {listData?.map((obj, idx) => (
                                <div className={`flex flex-row justify-between items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] hover:bg-[#379d0043] text-xs p-1`} onClick={() => actionOpenDetail(obj, 'overtime')}>
                                    <div className={`w-[90px] text-left text-[${baseColor}] underline p-1 cursor-pointer`} >{obj?.voucherNo}</div>
                                    <div className="w-[130px] text-center p-1">{convertDate(obj?.transDate) + ' ' + convertDate(obj?.startDate, 'time')}</div>
                                    <div className="w-[130px] text-center p-1">{convertDate(obj?.transDate) + ' ' + convertDate(obj?.endDate, 'time')}</div>
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

export default FormOvertime;