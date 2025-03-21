import React, { useState } from "react";
import InputContent from "../inputContent";
import Input from "../../input";
import MyDatePicker from "../../date_picker";
import { coverDate, formatText } from "../../../config/helper";
import SearchableSelect from "../../select2";
import IconImage from "../../icon_img";
import { add_g } from "../../../config/icon";

const FormUnattendance = ({dataObj, listType = [], handleSubmit, targetDate = null, showForm = false, setWidth = '100%'}) => {
    const [attendanceLog, setAttendanceLog] = useState([]);

    const [shiftDetail, setShiftDetail] = useState({
        date: '',
        clockIn: null,
        clockOut: null,
        clockInWeekend: null,
        clockOutWeekend: null,
        shiftName: '',
        unattendanceTypeID: '',
    })

    const handleChange = (event) => {
        // setFormData({
        //   ...formData,
        //   [event.target.name]: event.target.value,
        // });
    };

    const handleChangeSelect = (target, value) => {
        // setFormUnattendance({
        //     ...formData,
        //     [target]: value,
        //   });
    }


    return (
        <InputContent showForm={showForm} setWidth={setWidth} btnLabel="Edit"> 
            <div className="flex flex-row flex-wrap w-full">
                <MyDatePicker label={'Tanggal'} placeholder="Pilih Tanggal" setWidth="48%" value={targetDate} readOnly={true} />
                <div className="mx-2" />
                <SearchableSelect handleAction={handleChangeSelect} name={`unattendanceTypeID`} setPosition={'bottom'} label={'Tipe Ketidakhadiran'} placeHolder={'Tipe Ketidakhadiran'} setWidth="48%" options={listType} value={dataObj?.unattendanceTypeID} />
                <Input handleAction={handleChange} label={'Alasan'} subLabel={'(Opsional)'} setName={''} placeholder={'isi alasan'} content="textarea" />
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
        </InputContent>
    )
}

export default FormUnattendance;