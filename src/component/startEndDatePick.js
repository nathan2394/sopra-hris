import React, { useEffect, useRef, useState } from "react";
import { calendar_g } from "../config/icon";
import IconImage from "./icon_img";

const StartEndDatePick = ({setList}) => {
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if(startDate){
            endDateRef.current.showPicker();
        }
    }, [startDate])

    useEffect(() => {
        if(startDate && endDate){
            let start = new Date(startDate);
            let end = new Date(endDate); 
            let daysArray = [];
    
            while (start <= end) {
                daysArray.push({
                    date: `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
                });
                start.setDate(start.getDate() + 1); // Move to the next day
            }
    
            if(setList) setList(daysArray);
        }

    }, [endDate])

    const handleDatePick = () => {
        startDateRef.current.showPicker();
    }

    const handleStartDate = (e) => {
        setStartDate(e.target.value)
    }

    const handleEndDate = (e) => {
        setEndDate(e.target.value)
    }

    return (
        <div>
            <div className="bg-[#ffffff] border border-gray-300 rounded-lg flex flex-row items-center mr-2 cursor-pointer">
                <div className="w-[180px] pl-2" onClick={() => handleDatePick()}>
                    {(!startDate || !endDate) ? 
                        <p className="text-xs">Pilih Periode</p>
                        :
                        <div className="flex flex-row items-center">
                            <p className="text-xs">{startDate ?? '_____'}</p>
                            <p className="text-xs mx-2">-</p>
                            <p className="text-xs">{endDate ?? '_____'}</p>
                        </div>
                    }
                    <div className="hidden">
                        <input ref={startDateRef} type="date" onChange={(e) => handleStartDate(e)} className="w-auto text-xs"  />
                        <input ref={endDateRef} type="date" onChange={(e) => handleEndDate(e)} className="w-auto text-xs" />
                    </div>
                </div>
                <div className="bg-gray-300 h-[36px] w-[1px]" />
                <div className="p-2">
                    <IconImage size="normal" source={calendar_g} />
                </div>
            </div>
        </div>
    );
}

export default StartEndDatePick;