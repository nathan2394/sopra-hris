import { useEffect, useRef } from "react";
import { formatNum, formatText } from "../config/helper";
import { baseColor } from "../config/setting";
import Button from "./button";
import { minus, plus } from "../config/icon";

const Input = ({label, subLabel, targetRef = null, content = 'input', isFocus = false, setName, type, placeholder, sufix, setWidth = '100%', handleKeyDown, handleAction, value = '', textAlign = 'left', readOnly = false, showBtnNum = false}) => {
    const inputRef = useRef(null);

    const formatDate = (dateString, target) => {
        if(target === 'date'){
            return dateString ? dateString.split("T")[0] : ''; // Extracts only 'YYYY-MM-DD'
        }else{
            return dateString ? dateString.split("T")[1] : '';
        }
    };

    const handleClick = () => {
        inputRef.current.select();
    };

    const handleIncrement = () => {
        if (type === 'number' && !readOnly) {
            if(parseFloat(value) + 1 <= 4){
                handleAction({ target: { name: setName, value: parseFloat(value) + 1 } });
            }
        }
    };

    const handleDecrement = () => {
        if (type === 'number' && !readOnly) {
            if(parseFloat(value) - 1 >= -4){
                console.log(parseFloat(value) - 1);
                handleAction({ target: { name: setName, value: parseFloat(value) - 1 } });
            }
        }
    };

    useEffect(() => {
        if(inputRef && isFocus){
            inputRef?.current?.focus();
        }
    }, [inputRef])

    return (
        <div className={`${label ? 'mb-5' : '' }`} style={{width: setWidth }}>
            {label && <label className="block mb-2 text-xs font-medium text-gray-900">{label} <span className="text-xs text-gray-400">{subLabel || ''}</span> </label> }
            {sufix ? 
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm border border-gray-300 rounded-l-lg">
                        <p className="text-xs">{sufix}</p>
                    </span>
                    <input ref={inputRef} type={type} value={(type === 'date' || type === 'time') ? formatDate(value, type) || '' : value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[12px] px-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} />
                </div>
            : 
                content === 'input' ?
                <div className="flex">
                    {type === 'number' && showBtnNum ? (
                        <div className="flex items-center space-x-2">
                            <Button icon={minus} setWidth="auto" bgcolor={!readOnly ? baseColor : '#5b5b5bc3'} handleAction={readOnly ? null : handleDecrement}/>
                            <input ref={inputRef} type={type} value={value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[60%] py-[12px] px-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} />
                            <Button icon={plus} setWidth="auto" bgcolor={!readOnly ? baseColor : '#5b5b5bc3'} handleAction={readOnly ? null : handleIncrement}/>
                        </div>
                    ) : (<>
                        {type === 'number' && <input ref={inputRef} type={type} value={value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[12px] px-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} /> }
                    </>)}
                    {type !== 'number' && (
                        <input ref={inputRef} type={type} value={(type === 'date' || type === 'time') ? formatDate(value, type) || '' : value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[12px] px-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} />
                    )}
                </div>
                :
                <div className="flex">
                    <textarea ref={inputRef} rows="6" name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[12px] px-[9.35px]`} placeholder={placeholder} onKeyDown={handleKeyDown ? handleKeyDown : null} onChange={handleAction ? handleAction : null} required disabled={readOnly} onClick={handleClick} value={value} />
                </div>
            }
        </div>
    )
}

export default Input;