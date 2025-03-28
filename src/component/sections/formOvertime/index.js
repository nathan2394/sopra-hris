import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { convertDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import { useAPI } from "../../../config/fetchApi";
import { baseColor } from "../../../config/setting";
import { useNavigate } from "react-router-dom";

const FormOvertime = ({dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listType = [], listEmployee = [], handleChange, handleChangeSelect, handleView, targetDate = null, showForm = false, setWidth = '100%', btnApprove = false}) => {
    const navigate = useNavigate();
    const [listData, setListData] = useState([]);
    const localSetPeriod = JSON.parse(localStorage?.getItem('setPeriod'));

    const [duration, setDuration] = useState(dataObj?.duration || 0);
    const { deleteData, postData, loadData } = useAPI();

    //console.log(dataObj)

    const fetchOvertime = () => {
        if(localSetPeriod)
        loadData({url: 'Overtimes', params:[{title: 'date', value: `${localSetPeriod?.startDate}|${localSetPeriod?.endDate}`}]}).then((res) => {  
            const filteredData = res?.data.map(obj => {
                return {
                    id: obj?.overtimeID,
                    voucherNo: obj?.voucherNo,
                    transDate: obj?.transDate,
                    startDate: obj?.startDate,
                    endDate: obj?.endDate
                };
            }); 
            setListData(filteredData);
        });
    }

    useEffect(() => {
        fetchOvertime();
    }, []);

    useEffect(() => {
        if(dataObj?.startDate && dataObj?.endDate){
            setDuration((new Date(dataObj?.endDate) - new Date(dataObj?.startDate)) / (1000 * 60 * 60));
        }
    }, [dataObj?.startDate, dataObj?.endDate])

    const handleSubmit = () => {
        const requestData = {
            "employeeID": dataObj?.employeeID,
            "transDate": dataObj?.startDate,
            "startDate": dataObj?.startDate,
            "endDate": dataObj?.endDate,
            "reasonID": dataObj?.reasonID,
            "description": dataObj?.description,
        }

        console.log(requestData, isAdd, isEdit)
        // postData({url: 'Overtimes', formData: requestData})?.then((res) => {
        //     navigate(0);
        // })
    }

    return (
        <InputContent showForm={showForm} setWidth={setWidth} btnLabel="Tambah Lembur" isEdit={isEdit} setIsEdit={setIsEdit} isAdd={isAdd} setIsAdd={setIsAdd} handleAction={handleSubmit} showBtnApprove={btnApprove}> 
            {(isAdd || isEdit) ?          
                <div className="flex flex-row flex-wrap w-full">
                    {/* <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={null} type={'date'} /> */}
                    {listEmployee?.length > 0 && <>
                        <SearchableSelect handleAction={handleChange} name={`employeeID`} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Pilih Karyawan'} setWidth="48%" options={listEmployee} value={dataObj?.employeeID} isDisabled={isEdit} />
                        <div className="mx-2" />
                        <MyDatePicker handleAction={handleChange} label={'Tanggal Lembur'} name={'startDate'} setWidth="48%" value={dataObj?.startDate} />
                    </>}
                    {/* <MyDatePicker handleAction={handleChange} label={'Mulai Tanggal'} name={'startDate'} setWidth="48%" value={dataObj?.startDate} />
                    <div className="mx-2" />
                    <MyDatePicker handleAction={handleChange} label={'Sampai Tanggal'} name={'endDate'} setWidth="48%" value={dataObj?.endDate} /> */}
                    <MyDatePicker handleAction={handleChange} label={'Lembur Dari'} setWidth="48%" name={'startDate'} value={dataObj?.startDate} isTimeOnly={true} />
                    <div className="mx-2" />
                    <MyDatePicker handleAction={handleChange} label={'Lembur Sampai'} setWidth="48%" name={'endDate'} value={dataObj?.endDate} isTimeOnly={true} />
                    <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Jam'} setWidth="48%" value={`${formatText(duration)} Jam`} readOnly={true} />
                    <div className="mx-2" />
                    <SearchableSelect handleAction={handleChange} name={`reasonID`} setPosition={'bottom'} label={'Keterangan Lembur'} placeHolder={'Keterangan Lembur'} setWidth="48%" options={listType} value={dataObj?.reasonID} />
                    <Input handleAction={handleChange} label={'Notes'} setName={'description'} placeholder={'isi alasan'} content="textarea" value={dataObj?.description} />
                </div>
                :
                <>
                    <div className="text-xs mb-1">{'Data Lembur'}</div>
                    {(!isEdit && listData?.filter(obj => obj?.employeeID === dataObj?.employeeID)?.length > 0) ?
                        <div className="flex flex-col w-full">
                            <div className="text-xs mb-1">{'Data Lembur'}</div>
                            {listData?.filter(obj => obj?.employeeID === dataObj?.employeeID)?.map((obj, idx) => (
                                <div className={`flex flex-row justify-between items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] text-xs p-1`}>
                                    <div className={`w-[90px] text-left text-[${baseColor}] underline p-1 cursor-pointer`} onClick={() => handleView(obj?.overtimeID, listData)}>{obj?.voucherNo}</div>
                                    <div className="w-[130px] text-center p-1">{convertDate(obj?.transDate) + ' ' + convertDate(obj?.startDate, 'time')}</div>
                                    <div className="w-[130px] text-center p-1">{convertDate(obj?.transDate) + ' ' + convertDate(obj?.endDate, 'time')}</div>
                                    <div className="w-[70px] text-center">{'Pending'}</div>
                                </div>
                            ))}
                        </div>
                        :
                        <>
                            <div className="h-[100px] flex items-center justify-center">
                                <p className="text-center text-xs text-gray-400">Tidak ada data</p>
                            </div>
                        </>
                    }
                </>
            }
        </InputContent>
    )
}

export default FormOvertime;