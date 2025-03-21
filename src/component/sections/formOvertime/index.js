import React, { useEffect, useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { coverDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import { useAPI } from "../../../config/fetchApi";
import { baseColor } from "../../../config/setting";

const FormOvertime = ({dataObj, listType = [], listEmployee = [], handleSubmit, targetDate = null, showForm = false, setWidth = '100%'}) => {
    const [listData, setListData] = useState([]);

    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { deleteData, loadData } = useAPI();

    const fetchOvertime = () => {
        loadData({url: 'Overtimes'}).then((res) => {  
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
    }, [])

    const handleChange = (event) => {
        // setFormData({
        //   ...formData,
        //   [event.target.name]: event.target.value,
        // });
    };

    const handleChangeSelect = (target, value) => {
        // setFormOvertime({
        //     ...formData,
        //     [target]: value,
        //   });
    }


    return (
        <InputContent showForm={showForm} setWidth={setWidth} btnLabel="Tambah Lembur" isEdit={isEdit} setIsEdit={setIsEdit} isAdd={isAdd} setIsAdd={setIsAdd}> 
            {(!isEdit && listData?.length > 0) &&
                        <div className="flex flex-col w-full">
                            <div className="text-xs mb-1">{'Data Lembur'}</div>
                            {listData?.map((obj, idx) => (
                                <div className={`flex flex-row justify-between items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] text-xs p-1`}>
                                    <div className={`w-[90px] text-left text-[${baseColor}] underline p-1`}>{obj?.voucherNo}</div>
                                    <div className="w-[130px] text-center p-1">{coverDate(obj?.transDate) + ' ' + coverDate(obj?.startDate, 'time')}</div>
                                    <div className="w-[130px] text-center p-1">{coverDate(obj?.transDate) + ' ' + coverDate(obj?.endDate, 'time')}</div>
                                    <div className="w-[70px] text-center">{'Pending'}</div>
                                </div>
                            ))}
                        </div>
            }
            {(isAdd || isEdit) &&            
                <div className="flex flex-row flex-wrap w-full">
                    {/* <Input textAlign={'left'} handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={null} type={'date'} /> */}
                    {listEmployee?.length > 0 && 
                        <SearchableSelect handleAction={handleChangeSelect} name={`employeeID`} setPosition={'bottom'} label={'Cari Karyawan'} placeHolder={'Keterangan Lembur'} setWidth="100%" options={listEmployee} value={dataObj?.employeeID} />
                    }
                    <MyDatePicker handleAction={handleChange} label={'Mulai Tanggal'} setName={'startDate'} setWidth="48%" value={dataObj?.startDate} />
                    <div className="mx-2" />
                    <MyDatePicker handleAction={handleChange} label={'Sampai Tanggal'} setName={'endDate'} setWidth="48%" value={dataObj?.endDate} />
                    <MyDatePicker handleAction={handleChange} label={'Lerbur Dari'} setWidth="48%" setName={'startDate'} value={dataObj?.startDate} isTimeOnly={true} />
                    <div className="mx-2" />
                    <MyDatePicker handleAction={handleChange} label={'Lerbur Sampai'} setWidth="48%" setName={'startDate'} value={dataObj?.endDate} isTimeOnly={true} />
                    <Input textAlign={'left'} handleAction={handleChange} label={'Durasi Jam'} setWidth="48%" value={0} readOnly={true} />
                    <div className="mx-2" />
                    <SearchableSelect handleAction={handleChangeSelect} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Keterangan Lembur'} placeHolder={'Keterangan Lembur'} setWidth="48%" options={listType} value={dataObj?.reasonID} />
                    <Input handleAction={handleChange} label={'Notes'} setName={''} placeholder={'isi alasan'} content="textarea" value={null} />
                </div>
            }
        </InputContent>
    )
}

export default FormOvertime;