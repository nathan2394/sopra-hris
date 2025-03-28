import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { convertDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import IconImage from "../../icon_img";
import { add_g } from "../../../config/icon";
import { useAPI } from "../../../config/fetchApi";
import { useNavigate } from "react-router-dom";
import { baseColor } from "../../../config/setting";

const FormUnattendance = ({dataObj, isAdd, setIsAdd, isEdit, setIsEdit, listType = [], listEmployee, targetDate = null, showForm = false, setWidth = '100%', handleChange, handleChangeSelect, btnApprove = false}) => {
    const navigate = useNavigate();
    const [listData, setListData] = useState([]);
    const localSetPeriod = JSON.parse(localStorage?.getItem('setPeriod'));
    const [duration, setDuration] = useState(dataObj?.duration || 0);
    const { deleteData, loadData, postData } = useAPI();

    useEffect(() => {
        if(dataObj?.startDate && dataObj?.endDate){
            setDuration(Math.ceil((new Date(dataObj?.endDate) - new Date(dataObj?.startDate)) / (1000 * 60 * 60 * 24)));
        }
    }, [dataObj?.startDate, dataObj?.endDate]);

    useEffect(() => {
        fetchUnattendance();
    }, []);

    const fetchUnattendance = () => {
        if(localSetPeriod)
        loadData({url: 'Unattendances', params:[{title: 'date', value: `${localSetPeriod?.startDate}|${localSetPeriod?.endDate}`}]}).then((res) => {  
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

    const handleSubmit = () => {
        const requestData = {
            "employeeID": dataObj?.employeeID,
            "startDate": dataObj?.startDate,
            "endDate": dataObj?.endDate,
            "unattendanceTypeID": dataObj?.unattendanceTypeID,
            "description": dataObj?.description,
        }

        postData({url: 'Unattendances', formData: requestData})?.then((res) => {
            // console.log(res);
            navigate(0);
        })
    }

    return (
        <InputContent showForm={showForm} handleAction={handleSubmit} isAdd={isAdd} setIsAdd={setIsAdd} isEdit={isEdit} setIsEdit={setIsEdit} setWidth={setWidth}  btnLabel="Tambah Data" showBtnApprove={btnApprove}> 
            {(isAdd || isEdit) ?
                <div className="flex flex-row flex-wrap w-full">
                    {/* {listEmployee ? */}
                        <>
                        {listEmployee && <SearchableSelect handleAction={handleChange} name={`employeeID`} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Pilih Karyawan'} setWidth="100%" options={listEmployee} value={dataObj?.employeeID} isDisabled={isEdit} /> }
                        <MyDatePicker handleAction={handleChange} label={'Mulai Tanggal'} placeholder="Pilih Tanggal" name={'startDate'} setWidth="48%" value={dataObj?.startDate} isMinDateValidation={true} />
                        <div className="mx-2" />
                        <MyDatePicker handleAction={handleChange} label={'Sampai Tanggal'} placeholder="Pilih Tanggal" name={'endDate'} setWidth="48%" value={dataObj?.endDate} isMinDateValidation={true} />
                        <Input label={'Durasi Hari'} placeholder={'Durasi Ketidakhadiran'} setWidth="48%" value={`${duration} Hari`} readOnly={true} />
                        <div className="mx-2" />
                        <SearchableSelect handleAction={handleChange} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={listType} value={dataObj?.unattendanceTypeID} />
                        </> 
                        {/* :
                        <>
                        <MyDatePicker label={'Tanggal'} placeholder="Pilih Tanggal" setWidth="48%" value={targetDate} readOnly={true} />
                        <div className="mx-2" />
                        <SearchableSelect handleAction={handleChange} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={listType} value={dataObj?.unattendanceTypeID} />
                        </>
                    } */}
                    <Input handleAction={handleChange} label={'Alasan'} subLabel={'(Opsional)'} setName={'description'} placeholder={'isi alasan'} content="textarea" value={dataObj?.description} />
                </div>
                :
                <>
                    <div className="text-xs mb-1">{'Data Cuti & Ijin'}</div>
                    {(!isAdd && !isEdit && listData?.filter(obj => obj?.employeeID === dataObj?.employeeID)?.length > 0) ? <>
                        <div className="flex flex-col w-full overflow-y-auto max-h-[400px]">
                            {listData?.filter(obj => obj?.employeeID === dataObj?.employeeID)?.map((obj, idx) => (
                                <div className={`flex flex-row justify-between items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] text-xs p-1`}>
                                    <div className={`w-[90px] text-left text-[${baseColor}] underline p-1`}>{obj?.voucherNo}</div>
                                    <div className="w-[200px] text-center p-1">{`${convertDate(obj?.startDate)} - ${convertDate(obj?.endDate)}`}</div>
                                    <div className="w-[70px] text-center">{obj?.isApproved1 || obj?.isApproved2 ? 'Approve' : 'Pending'}</div>
                                </div>
                            ))}
                        </div>
                    </>
                    :
                    <>
                        <div className="h-[100px] flex items-center justify-center">
                            <p className="text-center text-xs text-gray-400">Tidak ada data</p>
                        </div>
                    </>
                    }
                </>
            }
            {/* <div className="w-full">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-xs">Lampiran</p>
                    <IconImage size="small" source={add_g} />
                </div>
                <div className="h-[100px] flex items-center justify-center">
                    <p className="text-center text-xs text-gray-400">Tidak ada Lampiran</p>
                </div>
            </div> */}
        </InputContent>
    )
}

export default FormUnattendance;