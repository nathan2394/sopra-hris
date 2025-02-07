import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconImage from "./icon_img";
import { calendar } from "../config/icon";

const MyDatePicker = ({label, setWidth = '100%', value}) => {
  const [date, setDate] = useState(value || null); // Start with null value
  const datePickerRef = useRef(null);
  
  const openDatePicker = () => {
    datePickerRef.current.setFocus(); // Programmatically open date picker
  };

  return (
    <div className="mb-5" style={{width: setWidth }}>
      {label && <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label> }
      <div className="relative border border-gray-300 text-gray-900 rounded-lg" style={{width: setWidth }} onClick={openDatePicker}>
        <DatePicker
            selected={date}
            onChange={(date) => setDate(date)} // Updates the state with selected date
            dateFormat="dd-MM-yyyy" // Formats the date display
            placeholderText="Select a date" // Shows a placeholder when no date is selected
            className="w-full px-4 py-2 rounded-lg focus:outline-none" // Tailwind styling for input
            calendarClassName="bg-white border border-gray-300 rounded-lg shadow-lg p-2" // Tailwind for calendar
            popperClassName="z-50"
            ref={datePickerRef}
        />
        <div className="absolute right-3 top-3">
            <IconImage size="small" source={calendar} />
        </div>
      </div>
    </div>
  );
};

export default MyDatePicker;
