import React, { useState } from "react";
import { filter } from "../config/icon";
import IconImage from "./icon_img";
import { baseColor } from "../config/setting";
import Button from "./button";

const FilterContent = ({ listFilter = [], checkedValue = {}, setCheckValue, setListFilter, isActive, setIsActive }) => {
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
                    <div className="flex flex-row items-center w-full">
                        <IconImage size="small" source={filter} />
                        <p className="font-bold text-sm px-2">Filter:</p>
                        <div className="flex gap-1 max-h-20 overflow-auto"> {/* Adjust max-width and ensure scroll */}
                            {Object.entries(checkedValue).map(([label, values]) =>
                                values.map((item) => (
                                    <span key={`${label}-${item.id}`} className="px-2 py-1 bg-white border border-gray-200 rounded-full flex justify-between items-center text-xs" style={{fontSize: '12px'}}>
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
                    <Button text="Reset" bgcolor={baseColor} color={'white'} setWidth="auto" setPadding="5px" handleAction={() => {
                        setListFilter([]);
                    }} />
                </div>
            </>}
        </>
    );    
};

export default FilterContent;