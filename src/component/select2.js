import React, { useEffect, useState } from "react";
import Select from "react-select";

const SearchableSelect = ({label, placeHolder = 'Select...', options, value, setValue, isDisabled = false, setWidth = '100%'}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if(options?.length > 0 && value) {
      setSelectedOption(options?.find(data => data?.value === value));
    }
  }, [value])

  return (
    <div className={label ? 'mb-5' : ''} style={{width: setWidth }}>
        {label && <label className="block mb-2 text-xs font-medium text-gray-900">{label}</label> }
        <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            isSearchable
            placeholder={placeHolder}
            noOptionsMessage={() => "No options found"} 
            isDisabled={isDisabled} 
            classNames={{
                control: () => "border border-gray-300 rounded-lg shadow-sm bg-white text-xs hover:border-blue-500 p-[2px]",
                menu: () => "bg-white border border-gray-300 rounded-lg mt-1 text-xs shadow-lg",
                option: ({ isFocused, isSelected }) =>
                    `px-4 py-2 cursor-pointer text-xs ${
                        isSelected ? "bg-blue-500 text-white" : isFocused ? "bg-gray-200" : "bg-white"
                }`,
            }}
            styles={{
                control: (base) => ({...base, borderRadius: '0.5rem'})
            }}
        />
    </div>
  );
};

export default SearchableSelect;
