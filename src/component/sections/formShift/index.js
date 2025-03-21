import React, { useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { coverDate, formatText } from "../../../config/helper";
import { baseColor } from "../../../config/setting";
import Button from "../../button";
import { add } from "../../../config/icon";

const FormShift = ({dataObj, listLog = [], targetDate = null, showForm = false, setWidth = '100%'}) => {

    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [shiftDetail, setShiftDetail] = useState({
        employeeID: dataObj?.employeeID,
        shiftID: 0,
        transDate: null,
        clockIn: null
    })

    const handleChange = (event) => {
        // setFormData({
        //   ...formData,
        //   [event.target.name]: event.target.value,
        // });
    };

    const handleChangeSelect = (target, value) => {
        // setFormShift({
        //     ...formData,
        //     [target]: value,
        //   });
    }

    const handleChangeDate = (target, value) => {
        setShiftDetail({
            ...shiftDetail,
            [target]: target === 'clockIn' ? coverDate(value, 'time') : coverDate(value, 'input'),
        });
    }

    const handleSubmit = () => {
        let obj = {
            employeeID: dataObj?.employeeID,
            shiftID: 3,
            transDate: shiftDetail?.transDate,
            attendances: [{
                employeeID: dataObj?.employeeID,
                clockIn: shiftDetail?.clockIn,
                description: "Manual"
            }]
        }
        console.log(obj)
    }


    return (
        <InputContent showForm={showForm} setWidth={setWidth} isEdit={isEdit} setIsEdit={setIsEdit} handleAction={handleSubmit}> 
            <div className="flex flex-row flex-wrap w-full">
                <MyDatePicker label={'Tanggal'} placeholder="Pilih Tanggal" setWidth="48%" value={targetDate} readOnly={true} />
                <div className="mx-2" />
                <Input textAlign={'left'} handleAction={handleChange} label={'Nama Shift'} setName={'endDate'} setWidth="48%" value={dataObj?.shiftName} type={'input'} />
                {/* <Input textAlign={'left'} handleAction={handleChange} label={'Jam Masuk'} setWidth="48%" value={'08.00'} readOnly={true} type={'time'} /> */}
                <MyDatePicker label={'Jam Masuk'} placeholder="Pilih Jam" setWidth="48%" value={dataObj?.clockIn} isTimeOnly={true} readOnly={true} />
                <div className="mx-2" />
                <MyDatePicker label={'Jam Keluar'} placeholder="Pilih Jam" setWidth="48%" value={dataObj?.clockOut} isTimeOnly={true} readOnly={true} />
            </div>
            <div className="w-full">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-xs">Scan Log</p>
                    {isEdit && 
                        <p className={`text-xs text-[${isAdd ? '#D22F27' : baseColor}] underline cursor-pointer`} onClick={() => setIsAdd(!isAdd)}>
                            {isAdd ? "Batal" : "Tambah Scan Log"}
                        </p> 
                    }
                </div>
                <div className={`h-[180px] overflow-y-visible border border-[#d1d1d1] bg-[#f0f0f0] rounded-md mt-2`}>
                    {listLog?.length > 0 ? 
                        <div className="flex flex-col w-full">
                            {listLog?.map((obj, idx) => (
                                <div className={`flex flex-row justify-center items-center ${idx%2 !== 0 ? 'bg-[#f0f0f0]' : 'bg-white'} border-b border-[#d1d1d1] text-xs p-1`}>
                                    <div className="w-[120px] text-center p-1">{formatText(obj?.clockIn)}</div>
                                    <div className="w-[120px] text-center">{coverDate(obj?.clockIn, 'time')}</div>
                                    <div className="w-[150px] text-left">{obj?.description || 'Sistem'}</div>
                                </div>
                            ))}
                            {(isAdd && isEdit) && 
                                <div className={`flex flex-row justify-center items-center bg-white border-b border-[#d1d1d1] text-xs p-2`}>
                                    <MyDatePicker name={'transDate'} handleAction={handleChangeDate} placeholder="Pilih Tanggal" setWidth="45%" value={shiftDetail?.transDate} />
                                    <div className="mx-1" />
                                    <MyDatePicker name={'clockIn'} handleAction={handleChangeDate} placeholder="Pilih Jam" setWidth="45%" value={shiftDetail?.clockIn} isTimeOnly={true} />
                                    <div className="mx-1" />
                                    <Button bgcolor={baseColor} setWidth="auto" icon={add} position="center" handleAction={handleSubmit} />
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
        </InputContent>
    )
}

export default FormShift;