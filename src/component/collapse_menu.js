import React, { useRef, useState } from "react";
import { arrow_green } from "../config/icon"
import IconImage from "./icon_img";

const CollapseMenu = ({title = 'Select', children, isSetOpen = false}) => {
    const [isOpen, setIsOpen] = useState(isSetOpen);

    return (
        <div className="cursor-pointer">
            <div className={`flex flex-row items-center justify-between px-4 ${isOpen ? 'pb-2' : 'pb-0'}`} style={{userSelect: 'none'}} onClick={() => setIsOpen(!isOpen)}>
                <p className="text-sm font-semibold">{title}</p>
                <IconImage size="small" source={arrow_green} rotate={isOpen}/>
            </div>
            <div className={`${isOpen ? 'h-auto' : 'h-0 hidden'} max-h-[300px] overflow-y-auto`}>
                {children}
            </div>
            <div className="bg-[#ddd] my-3 h-[1.5px]" />
        </div>
    )
}

export default CollapseMenu;