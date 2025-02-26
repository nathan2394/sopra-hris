import { useEffect, useRef } from "react";
import { formatNum, formatText } from "../config/helper";

const Input = ({label, targetRef = null, isFocus = false, setName, type, placeholder, sufix, setWidth = '100%', handleKeyDown, handleAction, value = '', textAlign = 'left', readOnly = false}) => {
    const inputRef = useRef(null);

    const formatDate = (dateString) => {
        return dateString ? dateString.split("T")[0] : ''; // Extracts only 'YYYY-MM-DD'
    };

    const handleClick = () => {
        inputRef.current.select();
    };

    useEffect(() => {
        if(inputRef && isFocus){
            inputRef?.current?.focus();
        }
    }, [inputRef])

    return (
        // <div className="py-2">
        //     <input type={type} className="border border-black rounded-lg p-1 text-sm" placeholder={placeholder} />
        //     {isError && <p className="font-normal italic text-red-700">text</p>}
        // </div>
        <div className="mb-5" style={{width: setWidth }}>
            {label && <label className="block mb-2 text-xs font-medium text-gray-900">{label}</label> }
            {sufix ? 
                <div className="flex">
                    <span class="inline-flex items-center px-3 text-sm border border-gray-300 rounded-l-lg">
                        <p className="text-xs">{sufix}</p>
                    </span>
                    <input ref={inputRef} type={type} value={type === 'date' ? formatDate(value) || '' : value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} />
                </div>
            : 
                <div className="flex">
                    <input ref={inputRef} type={type} value={type === 'date' ? formatDate(value) || '' : value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} />
                </div>
            }
        </div>
    )
}

export default Input;