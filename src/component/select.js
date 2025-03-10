import React, { useRef, useState } from "react";
import { arrow_g } from "../config/icon"
import IconImage from "./icon_img";

const Select = ({data = [], defaultLabel = '', name, handleAction = null, type, setWidth = '100%', filterVal = null, setFilter = null, value = null, setValue = null, isError = null, setIsFilter, listFilter = [], setListFilter}) => {
    const [open, setOpen] = useState(false);
    return (     
        <div className="py-2 relative">
            <div className="bg-[#ffffff] rounded-lg flex flex-row items-center mr-2 cursor-pointer" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)', userSelect: 'none'}} onClick={() => setOpen(!open)}>
                <div className="p-2 min-w-[150px]">
                    <p className="text-xs font-semibold">{`${filterVal ? filterVal : defaultLabel}`}</p>
                </div>
                <div className="bg-gray-400 h-[36px] w-[1px]"></div>
                <div className="p-2">
                    <IconImage size="small" source={arrow_g} />
                </div>
            </div>
            {(open && data?.length > 0) &&             
                <div className="absolute top-14 border border-gray-400 bg-[#ffffff] rounded-lg w-[180px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                    <div className="cursor-pointer p-2 border-b border-gray-400 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => {
                            setFilter(defaultLabel);
                            setListFilter([...listFilter?.filter(data => !data?.includes(name))]);
                            setIsFilter(true);
                            setValue(0);
                            setOpen(!open);
                            handleAction(name, 0);
                        } }>
                        <p className="text-xs font-normal">{defaultLabel}</p>
                    </div>
                    {data?.map((val, idx) => (
                        <div key={idx} className="cursor-pointer p-2 border-b border-gray-400 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => {
                            setFilter(val?.value);
                            // setSearchForm({...searchForm, [name]: val?.value })
                            setListFilter([...listFilter?.filter(data => !data?.includes(name)), `${name}: ${val?.value}`]);
                            setIsFilter(true);
                            setValue(val?.id);
                            setOpen(!open);
                            handleAction(name, val?.id);
                        } }>
                            <p className="text-xs font-normal">{val?.value}</p>
                        </div>
                    ))}
                </div>
            }
        </div>

    )
}

export default Select;