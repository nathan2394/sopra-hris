import React, { useState } from "react";
import { filter } from "../config/icon";
import IconImage from "./icon_img";
import { baseColor } from "../config/setting";
import Button from "./button";

const FilterContent = ({listFilter = [], checkedValue = {}, setCheckValue, setListFilter, isActive, setIsActive}) => {
    // console.log(listFilter)
    const removeFilter = (label, itemId) => {
        setCheckValue((prev) => {
          const newValues = { ...prev };
          newValues[label] = newValues[label].filter((v) => v.id !== itemId);
    
          if (newValues[label].length === 0) {
            delete newValues[label];
          }
    
          return newValues;
        });
    };

    return (
        <>
            {isActive && <>
                <div className="bg-[#e1e0e0] mb-3 h-[1.5px]" />
                <div className="mb-3 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                        <IconImage size="small" source={filter} />
                        <p className="font-bold text-sm px-2">Filter yang dipilih:</p>
                        <div className="flex flex-wrap gap-1">
                            {listFilter?.map((val, idx) => (
                                <div className="flex flex-row pl-2 text-xs" key={idx}>
                                    <span className="px-2 py-1 bg-white border border-gray-200 rounded-full flex items-center text-xs" style={{fontSize: '12px'}}>
                                    {val}
                                        <button
                                            className={`ml-2 text-[${baseColor}] font-bold text-xs`}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(checkedValue).map(([label, values]) =>
                                values.map((item) => (
                                    <span key={`${label}-${item.id}`} className="px-2 py-1 bg-white border border-gray-200 rounded-full flex items-center text-xs" style={{fontSize: '12px'}}>
                                    {label}: {item.value}
                                        <button
                                            onClick={() => removeFilter(label, item.id)}
                                            className={`ml-2 text-[${baseColor}] font-bold`}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                    <Button text="Reset Filter" bgcolor={baseColor} color={'white'} setWidth="auto" setPadding="5px" handleAction={() => {
                        setListFilter([]);
                    }} />
                </div>
            </>}
        </>
    )
}

export default FilterContent;