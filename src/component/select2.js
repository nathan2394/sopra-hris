import React, { useEffect, useRef } from "react";
import Select, { components } from "react-select";

const SearchableSelect = ({
  label,
  name,
  placeHolder = "Select...",
  setPosition = 'top',
  options,
  value,
  setValue,
  isFocus = false,
  isDisabled = false,
  setWidth = "100%",
  handleAction = null,
  handleAfterExecute = null,
  useSearchIcon = false, // Toggle for custom search icon
}) => {
  const [selectedOption, setSelectedOption] = React.useState(null);

  const selectRef = useRef(null);

  useEffect(() => {
    if (options?.length > 0 && value !== undefined) {
      setSelectedOption(options.find((data) => data.value === value) || null);
    }
    if(isFocus){
      if (selectRef.current) {
        selectRef.current.focus();
      }
    }
  }, [value, options]);

  useEffect(() => {
    if (setValue) {
      setValue(selectedOption?.value);
    }
  }, [selectedOption]);

  // Custom dropdown indicator logic
  const DropdownIndicator = (props) => {
    if (useSearchIcon) {
      return (
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            backgroundImage: "url('/icon/search.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      );
    } else {
      return <components.DropdownIndicator {...props} />; // Keep default arrow
    }
  };

  return (
    <div className={label ? "mb-5" : ""} style={{ width: setWidth }}>
      {label && (
        <label className="block mb-2 text-xs font-medium text-gray-900">
          {label}
        </label>
      )}
      <Select
        ref={selectRef}
        options={options}
        value={selectedOption}
        onChange={(value) => {
          setSelectedOption(value);
          if (handleAction) {
              // handleAction(name, value?.value);
              handleAction({ target: { name: name, value: value?.value } });
          }
          if (handleAfterExecute) {
              handleAfterExecute(value?.value);
          }
      }}
        isSearchable
        placeholder={placeHolder}
        noOptionsMessage={() => "No options found"}
        menuPlacement={setPosition}
        classNames={{
          control: () =>
            `border border-gray-300 rounded-lg shadow-sm bg-white text-xs hover:border-blue-500 ${useSearchIcon ? 'p-[5.5px]' : 'p-[2px]'} ${
              isDisabled ? "pointer-events-none bg-[]" : ""
            }`,
          menu: () =>
            "bg-white border border-gray-300 rounded-lg mt-1 text-xs shadow-lg",
          option: ({ isFocused, isSelected }) =>
            `px-4 py-2 cursor-pointer text-xs ${
              isSelected
                ? "bg-blue-500 text-white"
                : isFocused
                ? "bg-gray-200"
                : "bg-white"
            }`,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            backgroundColor: isDisabled ? "#f4f2f2cc" : "",
            paddingLeft: useSearchIcon ? "30px" : "", // Adjust padding only when search icon is active
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "150px", // Set max height
            overflowY: "auto", // Enable scrolling if too many options
          }),
        }}
        components={{ DropdownIndicator, IndicatorSeparator: useSearchIcon ? () => null : components.IndicatorSeparator }} // Set custom dropdown indicator
      />
    </div>
  );
};

export default SearchableSelect;
