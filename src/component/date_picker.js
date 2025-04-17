import React, { useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import IconImage from "./icon_img";
import { calendar, calendar_g, clock_g } from "../config/icon";
import DatePicker from "react-datepicker";
import { convertDate, formatText } from "../config/helper";

const MyDatePicker = ({label, name, placeholder = 'Pilih', setWidth = '100%', value, setValue, startDateVal, setStartDateVal, endDateVal, setEndDateVal, isRange = false, setList, isTimeOnly = false, isRequierd = false, isMinDateValidation = false, readOnly = false, handleAction}) => {
  const ref = useRef(null);
  const parseDate = (val) => {
    if (!val) return null;

    if (isTimeOnly && /^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
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
      if(startDateVal && endDateVal && setList){
        let start = new Date(startDateVal);
        let end = new Date(endDateVal); 
        let daysArray = [];

        while (start <= end) {
            daysArray.push({
                date: `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
            });
            start.setDate(start.getDate() + 1); // Move to the next day
        }

        if(setList) setList(daysArray);
      }
    }else{
      if(value){
        setDate(parseDate(value));
      }
    }
  }, [value, startDateVal, endDateVal])
  
  const openDatePicker = () => {
    datePickerRef.current.setFocus();
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

  const formatDateDisplayRange = (start, end) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  
    if (!start && !end) return '';
    if (start && !end) return `${formatter.format(start)} - ...`;
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }; 

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    let displayValue = '';

    if (isRange) {
      displayValue = formatDateDisplayRange(startDate, endDate);
    } else if (value) {
      displayValue = formatText(value);
    }
    
    return (
      <button
        type="button"
        className={`w-full text-left p-2 rounded-l-lg text-[12px] ${
          readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : ''
        }`}
        onClick={onClick}
        ref={ref}
      >
        {displayValue || placeholder}
      </button>
    )
  });

  return (
    <div className={`${label ? "mb-5" : ""}`} style={{width: setWidth}}>
      {label && <label className={`block mb-2 text-xs font-medium text-gray-900 ${isRequierd ? 'required-label' : ''}`}>{label}</label> }
      <div className={`relative border border-gray-300 text-gray-900 rounded-lg flex w-full py-[3.5px] ${readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : 'bg-white'}`}  onClick={openDatePicker}>
        <DatePicker
            selected={isRange ? startDate : date}
            onChange={isRange ? onChange : handleAction ? (date) => {
              if (isMinDateValidation && date < new Date()) return; // Prevent selecting past times
              handleAction({ target: { name: name, value: convertDate(date, 'full') } });
              setDate(date);
            } : null}
            timeFormat="HH:mm"
            showTimeSelect={isTimeOnly} // Enable time selection if needed
            showTimeSelectOnly={isTimeOnly} // Show only time if true
            dateFormat={isTimeOnly ? "HH:mm" : "yyyy-MM-dd"}
            placeholderText={placeholder}
            className={`w-full p-2 rounded-l-lg text-[12px] focus:outline-none ${readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : ''}`}
            calendarClassName="border border-gray-300 rounded-lg shadow-lg z-10"
            popperClassName="z-50"
            ref={datePickerRef}
            timeIntervals={60}
            startDate={isRange ? startDate : date}
            minDate={isMinDateValidation ? new Date() : null}
            endDate={isRange ? endDate : date}
            selectsRange={isRange}
            customInput={<CustomInput />}
        />
        <span className={`inline-flex items-center pl-2 pr-2 text-sm border-l border-gray-300 rounded-r-lg ${readOnly ? 'pointer-events-none bg-[#f4f2f2cc]' : 'bg-white'}`}>
          <IconImage size="normal" source={isTimeOnly ? clock_g : calendar_g} />
        </span>
      </div>
    </div>
  );
};

export default MyDatePicker;
