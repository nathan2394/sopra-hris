import React, { useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import IconImage from "./icon_img";
import { calendar, calendar_g, clock_g } from "../config/icon";
import DatePicker from "react-datepicker";

const MyDatePicker = ({label, placeholder = 'Pilih tanggal', setWidth = '100%', value, setValue, startDateVal, setStartDateVal, endDateVal, setEndDateVal, isRange = false, isTimeOnly = false, readOnly = false}) => {
  
  const parseDate = (val) => {
    if (!val) return null;

    if (isTimeOnly && /^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
      // If value is time-only (e.g., "07:00:00"), use today's date with time
      const [hours, minutes, seconds = 0] = val.split(":").map(Number);
      const today = new Date();
      today.setHours(hours, minutes, seconds, 0);
      return today;
    }

    return new Date(val); // Handle full datetime strings normally
  };
  
  const [date, setDate] = useState(null); // Start with null value
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if(isRange){
      if(startDateVal) setStartDate(parseDate(startDateVal));
      if(endDateVal) setEndDate(parseDate(endDateVal));
    }else{
      if(value){
        setDate(parseDate(value));
      }
    }
  }, [value, startDateVal, endDateVal])

  // useEffect(() => {
  //   if(startDate && endDate) 
  //     setStartDateVal(startDate);
  //     setEndDateVal(endDate);
  // }, [startDate, endDate])
  
  const openDatePicker = () => {
    datePickerRef.current.setFocus(); // Programmatically open date picker
  };


  const onChange = (dates) => {
    const [start, end] = dates;
    if(isRange){
      setStartDate(start);
      setEndDate(end);
      setStartDateVal(start);
      setEndDateVal(end);
    }
  };

  return (
    <div className={`${label ? "mb-5" : ""} ${readOnly ? 'pointer-events-none' : ''}`} style={{width: setWidth}}>
      {label && <label className="block mb-2 text-xs font-medium text-gray-900">{label}</label> }
      <div className="relative border border-gray-300 text-gray-900 rounded-lg flex w-full"  onClick={openDatePicker}>
        <DatePicker
            selected={isRange ? startDate : date}
            onChange={isRange ? onChange : (date) => setDate(date)}
            timeFormat="HH:mm"
            showTimeSelect={isTimeOnly} // Enable time selection if needed
            showTimeSelectOnly={isTimeOnly} // Show only time if true
            dateFormat={isTimeOnly ? "HH:mm" : "dd-MM-yyyy"}
            placeholderText={placeholder}
            className={`w-full px-4 py-2 rounded-l-lg text-[12px] focus:outline-none ${readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : ''}`}
            calendarClassName="border border-gray-300 rounded-lg shadow-lg"
            popperClassName="z-50"
            ref={datePickerRef}
            startDate={isRange ? startDate : date}
            endDate={isRange ? endDate : date}
            selectsRange={isRange}
        />
        <span className={`inline-flex items-center px-2 text-sm border-l border-gray-300 rounded-r-lg ${readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : 'bg-white'}`}>
          <IconImage size="normal" source={isTimeOnly ? clock_g : calendar_g} />
        </span>
      </div>
    </div>
  );
};

export default MyDatePicker;
